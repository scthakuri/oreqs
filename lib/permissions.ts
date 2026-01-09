import { type User } from './session';

export type Permission =
    | 'view_analytics'
    | 'manage_countries'
    | 'view_dealers'
    | 'manage_dealers'
    | 'view_clients'
    | 'manage_clients'
    | 'view_campaigns'
    | 'manage_campaigns'
    | 'view_branches'
    | 'manage_branches'
    | 'view_sms_marketing'
    | 'manage_sms_marketing'
    | 'view_email_marketing'
    | 'manage_email_marketing'
    | 'view_integration'
    | 'manage_integration';

export interface CRUDPermissions {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}

export function hasPermission(user: User | null, permission: Permission): boolean {
    if (!user || !user.is_active) return false;
    return user.permissions?.includes(permission) ?? false;
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
    if (!user) return false;
    return permissions.some(permission => hasPermission(user, permission));
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
    if (!user) return false;
    return permissions.every(permission => hasPermission(user, permission));
}

export function getCRUDPermissions(
    user: User | null,
    resource: 'dealers' | 'clients' | 'campaigns' | 'branches' | 'countries' | 'sms_marketing' | 'email_marketing' | 'integration'
): CRUDPermissions {
    if (!user) {
        return {
            canCreate: false,
            canRead: false,
            canUpdate: false,
            canDelete: false,
        };
    }

    const viewPermission = `view_${resource}` as Permission;
    const managePermission = `manage_${resource}` as Permission;

    const canView = hasPermission(user, viewPermission);
    const canManage = hasPermission(user, managePermission);

    return {
        canCreate: canManage,
        canRead: canView,
        canUpdate: canManage,
        canDelete: canManage,
    };
}

export function isAdmin(user: User | null): boolean {
    if (!user) return false;
    return user.is_superadmin || user.is_countryadmin;
}

export function isSuperAdmin(user: User | null): boolean {
    if (!user) return false;
    return user.is_superadmin;
}

export function getUserPermissions(user: User | null): Permission[] {
    if (!user) return [];
    return (user.permissions || []) as Permission[];
}

export function canAccessMarketing(user: User | null): boolean {
    return hasAnyPermission(user, [
        'view_sms_marketing',
        'view_email_marketing',
        'view_integration'
    ]);
}

export function canAccessManagement(user: User | null): boolean {
    return hasAnyPermission(user, [
        'view_dealers',
        'view_clients',
        'view_campaigns',
        'manage_countries'
    ]);
}