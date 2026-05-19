const { canAccessRole, normalizeWorkspaceRole, roleWeight } = require('../utils/workspaceRoles');

module.exports = function rbac({ roles = [], minRole = null, permissions = [] } = {}) {
  return (req, res, next) => {
    const userRole = normalizeWorkspaceRole(req.user?.role || req.user?.posterType || req.role);

    if (roles.length && !canAccessRole(userRole, roles)) {
      return res.status(403).json({ success: false, message: 'Forbidden', errorCode: 'FORBIDDEN' });
    }

    if (minRole && roleWeight(userRole) < roleWeight(minRole)) {
      return res.status(403).json({ success: false, message: 'Forbidden', errorCode: 'FORBIDDEN' });
    }

    req.workspaceRole = userRole;
    req.workspacePermissions = permissions;
    return next();
  };
};
