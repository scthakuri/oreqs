import { useAuth } from '@/context/auth-provider'

export interface MarketingPermissions {
    canViewMarketing: boolean
    canManageMarketingUsers: boolean
    canManageGroups: boolean
    canManageSMS: boolean
    canManageEmail: boolean
    canManageIntegrations: boolean
    canViewCampaigns: boolean
    canManageCampaigns: boolean
    hasAnySMSAccess: boolean
    hasAnyEmailAccess: boolean
    hasAnyMarketingAccess: boolean
}

export interface MarketingFeatures {
    campaignEnabled: boolean
    smsMarketingEnabled: boolean
    emailMarketingEnabled: boolean
    ownSMSGateway: boolean
    ownEmailService: boolean
}

function hasPermission(permissions: string[] | undefined, permission: string): boolean {
    return permissions?.includes(permission) ?? false
}

export function useMarketingPermissions() {
    const { user } = useAuth()
    const userPermissions = user?.permissions ?? []

    const permissions: MarketingPermissions = {
        canViewMarketing: hasPermission(userPermissions, 'view_sms_marketing') || hasPermission(userPermissions, 'view_email_marketing'),
        canManageMarketingUsers: hasPermission(userPermissions, 'manage_sms_marketing') || hasPermission(userPermissions, 'manage_email_marketing'),
        canManageGroups: hasPermission(userPermissions, 'manage_sms_marketing') || hasPermission(userPermissions, 'manage_email_marketing'),
        canManageSMS: hasPermission(userPermissions, 'manage_sms_marketing'),
        canManageEmail: hasPermission(userPermissions, 'manage_email_marketing'),
        canManageIntegrations: hasPermission(userPermissions, 'manage_integration'),
        canViewCampaigns: hasPermission(userPermissions, 'view_campaigns'),
        canManageCampaigns: hasPermission(userPermissions, 'manage_campaigns'),
        hasAnySMSAccess: hasPermission(userPermissions, 'view_sms_marketing') || hasPermission(userPermissions, 'manage_sms_marketing'),
        hasAnyEmailAccess: hasPermission(userPermissions, 'view_email_marketing') || hasPermission(userPermissions, 'manage_email_marketing'),
        hasAnyMarketingAccess:
            hasPermission(userPermissions, 'view_sms_marketing') ||
            hasPermission(userPermissions, 'manage_sms_marketing') ||
            hasPermission(userPermissions, 'view_email_marketing') ||
            hasPermission(userPermissions, 'manage_email_marketing'),
    }

    const features: MarketingFeatures = {
        campaignEnabled: user?.client?.enable_campaign ?? false,
        smsMarketingEnabled: user?.client?.enable_sms_marketing ?? false,
        emailMarketingEnabled: user?.client?.enable_email_marketing ?? false,
        ownSMSGateway: user?.client?.use_own_sms_gateway ?? false,
        ownEmailService: user?.client?.use_own_email_service ?? false,
    }

    const canAccessMarketing = permissions.hasAnyMarketingAccess

    return {
        permissions,
        features,
        canAccessMarketing,
        user,
    }
}

export function useIntegrationAccess() {
    const { permissions, features } = useMarketingPermissions()

    return {
        canManageIntegrations: permissions.canManageIntegrations,
        canUseSMSIntegration: features.smsMarketingEnabled && features.ownSMSGateway,
        canUseEmailIntegration: features.emailMarketingEnabled && features.ownEmailService,
        hasAnyIntegrationAccess:
            (features.smsMarketingEnabled && features.ownSMSGateway) ||
            (features.emailMarketingEnabled && features.ownEmailService),
    }
}

export function useCampaignTypeAccess(campaignType: 'email' | 'sms' | 'whatsapp' | 'push_notification') {
    const { permissions } = useMarketingPermissions()

    const typeMap = {
        email: permissions.hasAnyEmailAccess,
        sms: permissions.hasAnySMSAccess,
        whatsapp: permissions.hasAnySMSAccess,
        push_notification: false,
    }

    return typeMap[campaignType] ?? false
}
