import React from 'react';
import { hasPermission, getUserRole } from '../../utils/access';

export default function Can({ permission, roles, fallback = null, children }) {
  const userRole = getUserRole();
  const roleAllowed = !Array.isArray(roles) || roles.length === 0 || roles.includes(userRole);

  if (!roleAllowed || !hasPermission(permission)) {
    return fallback;
  }

  return children;
}
