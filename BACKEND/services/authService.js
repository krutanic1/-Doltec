const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

function hashSecret(secret) {
  return crypto.createHash('sha256').update(secret).digest('hex');
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return `${salt}$${derived}`;
}

function verifyPassword(password, stored) {
  if (!stored) return false;
  if (!stored.includes('$')) return password === stored;
  const [salt, derived] = stored.split('$');
  const candidate = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(derived));
}

function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role, email: user.email, tokenVersion: user.tokenVersion || 0 },
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '7d' }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: String(user._id), tokenVersion: user.tokenVersion || 0 },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
}

async function issueTokenPair(user, meta = {}) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refreshTokenHash = hashSecret(refreshToken);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: refreshTokenHash,
    userAgent: meta.userAgent || '',
    ip: meta.ip || '',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    revoked: false,
  });

  return { accessToken, refreshToken };
}

async function register({ name, email, phone, password, role = 'USER' }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('Email already registered');
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = hashPassword(password);
  const user = await User.create({
    name,
    email,
    // Convert empty string to undefined so the field is ABSENT in MongoDB.
    // An absent field is not indexed by the sparse unique index on phone/googleId.
    phone: phone || undefined,
    passwordHash,
    password,
    role,
    status: 'active',
    authProvider: 'local',
    emailVerified: false,
    // Do NOT include googleId at all — omitting it keeps the field absent,
    // which is the only safe approach with a sparse unique index.
  });

  return user;
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || user.status === 'blocked') {
    const error = new Error('Invalid email or password');
    error.statusCode = 400;
    throw error;
  }

  const passwordMatches = verifyPassword(password, user.passwordHash || user.password || '');
  if (!passwordMatches) {
    const error = new Error('Invalid email or password');
    error.statusCode = 400;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const tokens = await issueTokenPair(user);
  return { user, ...tokens };
}

async function refresh(refreshToken) {
  if (!refreshToken) {
    const error = new Error('Missing refresh token');
    error.statusCode = 401;
    throw error;
  }

  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  const user = await User.findById(payload.sub);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const tokenHash = hashSecret(refreshToken);
  const stored = await RefreshToken.findOne({ userId: user._id, tokenHash, revoked: false });
  if (!stored) {
    const error = new Error('Refresh token revoked or expired');
    error.statusCode = 401;
    throw error;
  }

  stored.revoked = true;
  await stored.save();

  const tokens = await issueTokenPair(user);
  return { user, ...tokens };
}

async function logout(refreshToken) {
  if (!refreshToken) return;
  const tokenHash = hashSecret(refreshToken);
  await RefreshToken.updateOne({ tokenHash }, { $set: { revoked: true } });
}

async function verifyGoogleCredential(credential) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
  if (!response.ok) {
    const error = new Error('Invalid Google credential');
    error.statusCode = 401;
    throw error;
  }

  const payload = await response.json();
  const email = payload.email;
  const googleId = payload.sub;

  if (!email || !googleId) {
    const error = new Error('Invalid Google payload');
    error.statusCode = 401;
    throw error;
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: payload.name || email.split('@')[0],
      email,
      phone: payload.phone_number || `google-${googleId.slice(-8)}`,
      role: 'user',
      authProvider: 'google',
      googleId,
      emailVerified: true,
      passwordHash: null,
      password: null,
    });
  }

  const tokens = await issueTokenPair(user);
  return { user, ...tokens };
}

module.exports = {
  hashPassword,
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  issueTokenPair,
  register,
  login,
  refresh,
  logout,
  verifyGoogleCredential,
};
