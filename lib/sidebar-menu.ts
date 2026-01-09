import {
    LayoutDashboard,
    Users,
    Building2,
    Megaphone,
    BarChart3,
    MessageSquare,
    UserCog,
    Bell,
    Globe,
    Mail,
    KeyRound,
    Settings,
    Building,
    UsersRound, Group, LucideProps,
} from 'lucide-react';
import { type User } from './session';
import { hasPermission } from './permissions';
import {ForwardRefExoticComponent, RefAttributes} from "react";

export interface NavItem {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    badge?: string;
    disabled?: boolean;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export function getSidebarMenu(user: User | null): NavGroup[] {
    if (!user || !user.is_active) return [];

    const navGroups: NavGroup[] = [];

    const overviewItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/admin',
            icon: LayoutDashboard,
        }
    ];

    if (hasPermission(user, 'view_analytics')) {
        overviewItems.push({
            title: 'Analytics',
            url: '/admin/analytics',
            icon: BarChart3,
        });
    }

    navGroups.push({
        title: 'Overview',
        items: overviewItems,
    });

    const managementItems: NavItem[] = [];

    if (hasPermission(user, 'manage_countries')) {
        managementItems.push({
            title: 'Countries',
            url: '/admin/settings/countries',
            icon: Globe,
        });
    }

    if (hasPermission(user, 'view_dealers')) {
        managementItems.push({
            title: 'Dealers',
            url: '/admin/dealers',
            icon: UsersRound,
        });
    }

    if (hasPermission(user, 'view_clients')) {
        managementItems.push({
            title: 'Clients',
            url: '/admin/clients',
            icon: Building2,
        });
    }

    if (hasPermission(user, 'view_campaigns')) {
        managementItems.push({
            title: 'Campaigns',
            url: '/admin/campaigns',
            icon: Megaphone,
        });
    }

    if (hasPermission(user, 'view_branches')) {
        managementItems.push({
            title: 'Branches',
            url: '/admin/branches',
            icon: Building,
        });
    }

    if (managementItems.length > 0) {
        navGroups.push({
            title: 'Management',
            items: managementItems,
        });
    }

    const marketingItems: NavItem[] = [];

    if (hasPermission(user, 'view_sms_marketing') || hasPermission(user, 'view_email_marketing')) {
        marketingItems.push({
            title: 'Groups',
            url: '/admin/marketing/groups',
            icon: Group,
        });

        marketingItems.push({
            title: 'Users',
            url: '/admin/marketing/users',
            icon: Users,
        });
    }

    if (hasPermission(user, 'view_sms_marketing')) {
        marketingItems.push({
            title: 'SMS Marketing',
            url: '/admin/marketing/sms',
            icon: MessageSquare,
        });
    }

    if (hasPermission(user, 'view_email_marketing')) {
        marketingItems.push({
            title: 'Email Marketing',
            url: '/admin/marketing/email',
            icon: Mail,
        });
    }

    if (hasPermission(user, 'view_integration')) {
        marketingItems.push({
            title: 'Integration',
            url: '/admin/marketing/integration',
            icon: Settings,
        });
    }

    if (marketingItems.length > 0) {
        navGroups.push({
            title: 'Marketing',
            items: marketingItems,
        });
    }

    navGroups.push({
        title: 'Settings',
        items: [
            {
                title: 'Profile',
                url: '/admin/settings/profile',
                icon: UserCog,
            },
            {
                title: 'Security',
                url: '/admin/settings/security',
                icon: KeyRound,
            },
            {
                title: 'Notifications',
                url: '/admin/settings/notifications',
                icon: Bell,
            },
        ],
    });

    return navGroups;
}

export function getQuickActions(user: User | null): NavItem[] {
    if (!user || !user.is_active) return [];

    const actions: NavItem[] = [];

    if (hasPermission(user, 'manage_campaigns')) {
        actions.push({
            title: 'New Campaign',
            url: '/admin/campaigns/new',
            icon: Megaphone,
        });
    }

    if (hasPermission(user, 'manage_clients')) {
        actions.push({
            title: 'New Client',
            url: '/admin/clients/new',
            icon: Building2,
        });
    }

    if (hasPermission(user, 'manage_sms_marketing')) {
        actions.push({
            title: 'Send SMS',
            url: '/admin/marketing/sms/new',
            icon: MessageSquare,
        });
    }

    if (hasPermission(user, 'manage_email_marketing')) {
        actions.push({
            title: 'Send Email',
            url: '/admin/marketing/email/new',
            icon: Mail,
        });
    }

    return actions;
}