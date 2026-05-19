const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    const { accessToken, refreshToken } = await authService.issueTokenPair(user);
    return res.status(201).json({
      token: accessToken,
      refreshToken,
      user: {
        id: user.id || String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        orgId: user.orgId || null,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error from MongoDB — try to surface which field caused it
      const dupKey = err.keyValue && Object.keys(err.keyValue)[0];
      const dupVal = dupKey ? err.keyValue[dupKey] : null;
      const msg = dupKey ? `${dupKey} (${dupVal}) already in use.` : 'Phone number or email already in use.';
      return res.status(400).json({ msg, field: dupKey || null, value: dupVal || null });
    }
    res.status(err.statusCode || 500).json({ msg: err.message || 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    return res.json({
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        orgId: user.orgId || null,
      },
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ msg: err.message || 'Server error', error: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken || null;
    const { user, accessToken, refreshToken: nextRefreshToken } = await authService.refresh(refreshToken);
    return res.json({
      token: accessToken,
      refreshToken: nextRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        orgId: user.orgId || null,
      },
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ msg: err.message || 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken || null;
    await authService.logout(refreshToken);
    return res.status(200).json({ msg: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ msg: err.message || 'Server error' });
  }
};
