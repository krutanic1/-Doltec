const ROLE_ALIASES = {
  admin: 'super_admin',
  ADMIN: 'super_admin',
  USER: 'support',
  OWNER: 'agency_owner',
  BUILDER: 'agency_owner',
  AGENT: 'agent',
  support: 'support',
  agent: 'agent',
  manager: 'manager',
  agency_owner: 'agency_owner',
  super_admin: 'super_admin',
};

const ROLE_ORDER = {
  super_admin: 100,
  agency_owner: 80,
  manager: 60,
  agent: 40,
  support: 20,
};

function normalizeWorkspaceRole(role) {
  if (!role) return 'support';
  return ROLE_ALIASES[role] || ROLE_ALIASES[String(role).toUpperCase()] || ROLE_ALIASES[String(role).toLowerCase()] || String(role).toLowerCase();
}

function canAccessRole(userRole, allowedRoles = []) {
  const normalizedUserRole = normalizeWorkspaceRole(userRole);
  if (!allowedRoles.length) return true;
  return allowedRoles.map(normalizeWorkspaceRole).includes(normalizedUserRole);
}

function roleWeight(role) {
  return ROLE_ORDER[normalizeWorkspaceRole(role)] || 0;
}

module.exports = {
  normalizeWorkspaceRole,
  canAccessRole,
  roleWeight,
  ROLE_ORDER,
};
