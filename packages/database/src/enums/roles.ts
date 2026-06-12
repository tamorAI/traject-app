export const ADMIN_ROLES = {
  ROLE_SUPERADMIN: ["ROLE_ADMIN"],
  ROLE_ADMIN: ["ROLE_ORG_ADMIN"],
  ROLE_ORG_ADMIN: [
    "ROLE_ORG_CREATE",
    "ROLE_ORG_READ",
    "ROLE_ORG_LIST",
    "ROLE_ORG_UPDATE",
    "ROLE_ORG_DELETE",
  ],
} as const;

export const ORG_ADMIN_ROLES = {
  ROLE_SUPERADMIN: ["ROLE_ADMIN"],
  ROLE_ADMIN: ["ROLE_ORG_ADMIN"],
  ROLE_USER_ADMIN: ["ROLE_USER_READ", "ROLE_USER_LIST", "ROLE_USER_KYC_VERIFY"],
} as const;

type OrgAdminRoles = typeof ORG_ADMIN_ROLES;
type AdminRoles = typeof ADMIN_ROLES;

export type NormalizedOrgAdminRoles =
  | keyof OrgAdminRoles
  | OrgAdminRoles[keyof OrgAdminRoles][number];

export type NormalizedAdminRoles =
  | keyof AdminRoles
  | AdminRoles[keyof AdminRoles][number];

export const normalizeAdminRoles = (roles: NormalizedAdminRoles[]) => {
  const normalized: NormalizedAdminRoles[] = [];

  roles.forEach((role) => {
    normalized.push(role);

    const childRoles = ADMIN_ROLES[role as keyof AdminRoles] || [];
    normalized.push(...childRoles);
  });

  return normalized;
};

export const normalizeTenantAdminRoles = (roles: NormalizedOrgAdminRoles[]) => {
  const normalized: NormalizedOrgAdminRoles[] = [];

  roles.forEach((role) => {
    normalized.push(role);

    const childRoles = ORG_ADMIN_ROLES[role as keyof OrgAdminRoles] || [];
    normalized.push(...childRoles);
  });

  return normalized;
};

export const createAdminRoleChecker = (userRoles: NormalizedAdminRoles[]) => {
  const set = new Set(userRoles);
  return (roles: NormalizedAdminRoles[], type = "AND" as "AND" | "OR") =>
    verifyAdminRoles(set, roles, type);
};

export const createTenantAdminRoleChecker = (
  userRoles: NormalizedOrgAdminRoles[],
) => {
  const set = new Set(userRoles);
  return (roles: NormalizedOrgAdminRoles[], type = "AND" as "AND" | "OR") =>
    verifyOrgAdminRoles(set, roles, type);
};

export const verifyAdminRoles = (
  userRolesSet: Set<NormalizedAdminRoles>,
  roles: NormalizedAdminRoles[],
  type = "AND" as "AND" | "OR",
) => {
  if (userRolesSet.has("ROLE_SUPERADMIN")) return true;
  if (type === "AND") {
    return roles.every((role) => userRolesSet.has(role));
  }
  return roles.some((role) => userRolesSet.has(role));
};

export const verifyOrgAdminRoles = (
  userRolesSet: Set<NormalizedOrgAdminRoles>,
  roles: NormalizedOrgAdminRoles[],
  type = "AND" as "AND" | "OR",
) => {
  if (userRolesSet.has("ROLE_SUPERADMIN")) return true;
  if (type === "AND") {
    return roles.every((role) => userRolesSet.has(role));
  }
  return roles.some((role) => userRolesSet.has(role));
};
