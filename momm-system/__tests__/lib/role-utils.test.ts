import { describe, it, expect } from 'vitest';
import {
  getRolePermissions,
  hasPermission,
  getRoleDisplayName,
  getRoleColor,
  type UserRole,
} from '@/lib/role-utils';

// ───────────────────────────────────────────────────────────
// getRolePermissions
// ───────────────────────────────────────────────────────────
describe('getRolePermissions', () => {
  it('admin has all permissions enabled', () => {
    const perms = getRolePermissions('admin');
    expect(perms.canCreateMeeting).toBe(true);
    expect(perms.canEditMeeting).toBe(true);
    expect(perms.canCancelMeeting).toBe(true);
    expect(perms.canManageUsers).toBe(true);
    expect(perms.canManageMasterData).toBe(true);
    expect(perms.canViewAllMeetings).toBe(true);
    expect(perms.canMarkAttendance).toBe(true);
    expect(perms.canUploadDocuments).toBe(true);
    expect(perms.canViewReports).toBe(true);
    expect(perms.canManageDepartments).toBe(true);
    expect(perms.canManageVenues).toBe(true);
  });

  it('convener can create, edit, cancel meetings and mark attendance but cannot manage users', () => {
    const perms = getRolePermissions('convener');
    expect(perms.canCreateMeeting).toBe(true);
    expect(perms.canEditMeeting).toBe(true);
    expect(perms.canCancelMeeting).toBe(true);
    expect(perms.canMarkAttendance).toBe(true);
    expect(perms.canUploadDocuments).toBe(true);
    expect(perms.canViewReports).toBe(true);
    // restricted
    expect(perms.canManageUsers).toBe(false);
    expect(perms.canManageMasterData).toBe(false);
    expect(perms.canViewAllMeetings).toBe(false);
    expect(perms.canManageDepartments).toBe(false);
    expect(perms.canManageVenues).toBe(false);
  });

  it('staff has all permissions disabled', () => {
    const perms = getRolePermissions('staff');
    const allFalse = Object.values(perms).every(v => v === false);
    expect(allFalse).toBe(true);
  });

  it('returns an object with exactly 11 permission keys', () => {
    const perms = getRolePermissions('admin');
    expect(Object.keys(perms)).toHaveLength(11);
  });
});

// ───────────────────────────────────────────────────────────
// hasPermission
// ───────────────────────────────────────────────────────────
describe('hasPermission', () => {
  it('returns true for admin canManageUsers', () => {
    expect(hasPermission('admin', 'canManageUsers')).toBe(true);
  });

  it('returns false for staff canCreateMeeting', () => {
    expect(hasPermission('staff', 'canCreateMeeting')).toBe(false);
  });

  it('returns false for convener canManageVenues', () => {
    expect(hasPermission('convener', 'canManageVenues')).toBe(false);
  });

  it('returns true for convener canUploadDocuments', () => {
    expect(hasPermission('convener', 'canUploadDocuments')).toBe(true);
  });

  it('admin has all 11 permissions as true', () => {
    const perms = getRolePermissions('admin');
    const permKeys = Object.keys(perms) as (keyof typeof perms)[];
    permKeys.forEach(key => {
      expect(hasPermission('admin', key)).toBe(true);
    });
  });

  it('staff has all 11 permissions as false', () => {
    const perms = getRolePermissions('staff');
    const permKeys = Object.keys(perms) as (keyof typeof perms)[];
    permKeys.forEach(key => {
      expect(hasPermission('staff', key)).toBe(false);
    });
  });
});

// ───────────────────────────────────────────────────────────
// getRoleDisplayName
// ───────────────────────────────────────────────────────────
describe('getRoleDisplayName', () => {
  it('returns "Administrator" for admin', () => {
    expect(getRoleDisplayName('admin')).toBe('Administrator');
  });

  it('returns "Meeting Convener" for convener', () => {
    expect(getRoleDisplayName('convener')).toBe('Meeting Convener');
  });

  it('returns "Staff Member" for staff', () => {
    expect(getRoleDisplayName('staff')).toBe('Staff Member');
  });

  it('returns a non-empty string for every role', () => {
    const roles: UserRole[] = ['admin', 'convener', 'staff'];
    roles.forEach(role => {
      expect(getRoleDisplayName(role).length).toBeGreaterThan(0);
    });
  });
});

// ───────────────────────────────────────────────────────────
// getRoleColor
// ───────────────────────────────────────────────────────────
describe('getRoleColor', () => {
  it('returns an object with bg, text, border, hover for every role', () => {
    const roles: UserRole[] = ['admin', 'convener', 'staff'];
    roles.forEach(role => {
      const color = getRoleColor(role);
      expect(color).toHaveProperty('bg');
      expect(color).toHaveProperty('text');
      expect(color).toHaveProperty('border');
      expect(color).toHaveProperty('hover');
    });
  });

  it('admin color uses blue', () => {
    const color = getRoleColor('admin');
    expect(color.bg).toContain('blue');
    expect(color.text).toContain('blue');
  });

  it('convener color uses green', () => {
    const color = getRoleColor('convener');
    expect(color.bg).toContain('green');
  });

  it('staff color uses purple', () => {
    const color = getRoleColor('staff');
    expect(color.bg).toContain('purple');
  });

  it('hover class contains "hover:" prefix', () => {
    const roles: UserRole[] = ['admin', 'convener', 'staff'];
    roles.forEach(role => {
      expect(getRoleColor(role).hover).toMatch(/^hover:/);
    });
  });
});
