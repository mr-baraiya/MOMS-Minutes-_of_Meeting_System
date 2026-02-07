/**
 * Role-based utilities and type definitions
 */

export type UserRole = 'admin' | 'convener' | 'staff';

export interface RolePermissions {
  canCreateMeeting: boolean;
  canEditMeeting: boolean;
  canCancelMeeting: boolean;
  canManageUsers: boolean;
  canManageMasterData: boolean;
  canViewAllMeetings: boolean;
  canMarkAttendance: boolean;
  canUploadDocuments: boolean;
  canViewReports: boolean;
  canManageDepartments: boolean;
  canManageVenues: boolean;
}

/**
 * Get permissions for a specific role
 */
export function getRolePermissions(role: UserRole): RolePermissions {
  const permissions: Record<UserRole, RolePermissions> = {
    admin: {
      canCreateMeeting: true,
      canEditMeeting: true,
      canCancelMeeting: true,
      canManageUsers: true,
      canManageMasterData: true,
      canViewAllMeetings: true,
      canMarkAttendance: true,
      canUploadDocuments: true,
      canViewReports: true,
      canManageDepartments: true,
      canManageVenues: true,
    },
    convener: {
      canCreateMeeting: true,
      canEditMeeting: true,
      canCancelMeeting: true,
      canManageUsers: false,
      canManageMasterData: false,
      canViewAllMeetings: false,
      canMarkAttendance: true,
      canUploadDocuments: true,
      canViewReports: true,
      canManageDepartments: false,
      canManageVenues: false,
    },
    staff: {
      canCreateMeeting: false,
      canEditMeeting: false,
      canCancelMeeting: false,
      canManageUsers: false,
      canManageMasterData: false,
      canViewAllMeetings: false,
      canMarkAttendance: false,
      canUploadDocuments: false,
      canViewReports: false,
      canManageDepartments: false,
      canManageVenues: false,
    },
  };

  return permissions[role];
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(
  role: UserRole,
  permission: keyof RolePermissions
): boolean {
  const permissions = getRolePermissions(role);
  return permissions[permission];
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    admin: 'Administrator',
    convener: 'Meeting Convener',
    staff: 'Staff Member',
  };

  return displayNames[role];
}

/**
 * Get role color theme
 */
export function getRoleColor(role: UserRole): {
  bg: string;
  text: string;
  border: string;
  hover: string;
} {
  const colors: Record<
    UserRole,
    { bg: string; text: string; border: string; hover: string }
  > = {
    admin: {
      bg: 'bg-blue-600',
      text: 'text-blue-600',
      border: 'border-blue-600',
      hover: 'hover:bg-blue-700',
    },
    convener: {
      bg: 'bg-green-600',
      text: 'text-green-600',
      border: 'border-green-600',
      hover: 'hover:bg-green-700',
    },
    staff: {
      bg: 'bg-purple-600',
      text: 'text-purple-600',
      border: 'border-purple-600',
      hover: 'hover:bg-purple-700',
    },
  };

  return colors[role];
}

/**
 * Get dashboard route for a role
 */
export function getDashboardRoute(role: UserRole): string {
  return `/${role}/dashboard`;
}

/**
 * Validate if a string is a valid role
 */
export function isValidRole(role: string): role is UserRole {
  return ['admin', 'convener', 'staff'].includes(role);
}

/**
 * Get allowed routes for a role
 */
export function getAllowedRoutes(role: UserRole): string[] {
  const routes: Record<UserRole, string[]> = {
    admin: [
      '/admin/dashboard',
      '/meetings',
      '/calendar',
      '/documents',
      '/reports',
      '/users',
      '/staff',
      '/departments',
      '/venues',
      '/meeting-types',
      '/admin/settings',
    ],
    convener: [
      '/convener/dashboard',
      '/meetings',
      '/calendar',
      '/documents',
      '/reports',
      '/convener/settings',
    ],
    staff: [
      '/staff/dashboard',
      '/meetings',
      '/calendar',
      '/documents',
      '/attendance',
      '/staff/settings',
    ],
  };

  return routes[role];
}

/**
 * Check if a role can access a specific route
 */
export function canAccessRoute(role: UserRole, route: string): boolean {
  const allowedRoutes = getAllowedRoutes(role);
  return allowedRoutes.some((allowed) => route.startsWith(allowed));
}
