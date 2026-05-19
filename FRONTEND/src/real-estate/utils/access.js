const ROLE_ALIASES = {
  owner: 'OWNER',
  agent: 'AGENT',
  builder: 'BUILDER',
  seller: 'SELLER',
  dealer: 'SELLER',
  admin: 'ADMIN',
  user: 'OWNER',
};

const ROLE_PERMISSIONS = {
  ADMIN: ['*'],
  SELLER: ['dashboard:view', 'property:list', 'property:create', 'property:update', 'saved:view', 'compare:view', 'lead:view', 'workspace:view', 'account:manage'],
  BUILDER: ['dashboard:view', 'property:list', 'property:create', 'property:update', 'saved:view', 'compare:view', 'lead:view', 'workspace:view', 'account:manage'],
  AGENT: ['dashboard:view', 'property:list', 'property:create', 'property:update', 'saved:view', 'compare:view', 'lead:view', 'workspace:view', 'account:manage'],
  OWNER: ['dashboard:view', 'property:list', 'property:create', 'property:update', 'saved:view', 'compare:view', 'lead:view', 'workspace:view', 'account:manage'],
};

function normalizeRole(value) {
  if (!value) return 'OWNER';
  const direct = String(value).trim().toUpperCase();
  return ROLE_ALIASES[direct.toLowerCase()] || direct;
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

export function getUserRole(user = getStoredUser()) {
  if (!user) return 'GUEST';

  return normalizeRole(
    user.role ||
    user.userType ||
    user.posterType ||
    user.accountType ||
    (user.isAdmin ? 'ADMIN' : '') ||
    'OWNER'
  );
}

export function getUserPermissions(user = getStoredUser()) {
  const role = getUserRole(user);
  const rolePermissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.OWNER;
  const directPermissions = Array.isArray(user?.permissions) ? user.permissions : [];

  return new Set([...rolePermissions, ...directPermissions]);
}

export function hasPermission(permission, user = getStoredUser()) {
  if (!permission) return true;
  const permissions = getUserPermissions(user);
  return permissions.has('*') || permissions.has(permission);
}

export function canAccess(routeConfig, user = getStoredUser()) {
  if (!routeConfig) return true;

  const role = getUserRole(user);
  if (routeConfig.public) return true;
  if (Array.isArray(routeConfig.roles) && routeConfig.roles.length > 0 && !routeConfig.roles.includes(role)) {
    return false;
  }

  return hasPermission(routeConfig.permission, user);
}
