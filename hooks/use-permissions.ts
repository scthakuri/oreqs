'use client';

import { useAuth } from '@/context/auth-provider';
import {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getCRUDPermissions,
    isAdmin,
    isSuperAdmin,
    getUserPermissions,
    canAccessMarketing,
    canAccessManagement,
    type Permission,
    type CRUDPermissions,
} from '@/lib/permissions';

export function usePermissions() {
    const { user } = useAuth();

    return {
        hasPermission: (permission: Permission) => hasPermission(user, permission),
        hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(user, permissions),
        hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(user, permissions),
        getCRUDPermissions: (
            resource: 'dealers' | 'clients' | 'campaigns' | 'branches' | 'countries' | 'sms_marketing' | 'email_marketing' | 'integration'
        ): CRUDPermissions => getCRUDPermissions(user, resource),
        isAdmin: () => isAdmin(user),
        isSuperAdmin: () => isSuperAdmin(user),
        getUserPermissions: () => getUserPermissions(user),
        canAccessMarketing: () => canAccessMarketing(user),
        canAccessManagement: () => canAccessManagement(user),
        user,
    };
}