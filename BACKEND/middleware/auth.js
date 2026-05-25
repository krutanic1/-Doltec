const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  console.log('[DEBUG AUTH] authHeader:', authHeader);

  // Check if not token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[DEBUG AUTH] No valid Bearer header');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  console.log('[DEBUG AUTH] token substring:', token ? token.substring(0, 15) + '...' : 'null');

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET);
    console.log('[DEBUG AUTH] decoded token:', JSON.stringify(decoded));
    if (decoded?.user && typeof decoded.user === 'object') {
      req.user = { ...decoded.user, role: decoded.user.role || decoded.role || decoded.posterType };
    } else {
      req.user = decoded;
    }
    if (decoded?.role && !req.role) {
      req.role = decoded.role;
    }
    next();
  } catch (err) {
    console.error('[DEBUG AUTH] jwt verification error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
