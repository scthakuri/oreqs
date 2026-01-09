import {
    LayoutDashboard,
    Users,
    Building2,
    Megaphone,
    BarChart3,
    MessageSquare,
    Settings,
    CreditCard,
    UserCog,
    Bell,
    Shield,
    Globe,
    Mail,
} from 'lucide-react'
import {type SidebarData} from '@/types/sidebar'

export const sidebarData: SidebarData = {
    user: {
        name: 'Super Admin',
        email: 'admin@oreqs.com',
        avatar: '', // Add your avatar image to /public/avatars/ folder
    },
    teams: [],
    navGroups: [
        {
            title: 'Overview',
            items: [
                {
                    title: 'Dashboard',
                    url: '/admin',
                    icon: LayoutDashboard,
                },
                {
                    title: 'Analytics',
                    url: '/admin/analytics',
                    icon: BarChart3,
                },
            ],
        },
        {
            title: 'Management',
            items: [
                {
                    title: 'Country Admins',
                    url: '/admin/country-admins',
                    icon: UserCog,
                },
                {
                    title: 'Dealers',
                    url: '/admin/dealers',
                    icon: Users,
                },
                {
                    title: 'Clients',
                    url: '/admin/clients',
                    icon: Building2,
                },
                {
                    title: 'Campaigns',
                    url: '/admin/campaigns',
                    icon: Megaphone,
                },
            ],
        },
        {
            title: 'Marketing',
            items: [
                {
                    title: 'SMS Marketing',
                    url: '/admin/marketing/sms',
                    icon: MessageSquare,
                },
                {
                    title: 'Email Marketing',
                    url: '/admin/marketing/email',
                    icon: Mail,
                },
            ],
        },
        {
            title: 'Services',
            items: [
                {
                    title: 'SMS Credits',
                    url: '/admin/sms-credits',
                    icon: MessageSquare,
                },
                {
                    title: 'Billing',
                    url: '/admin/billing',
                    icon: CreditCard,
                },
            ],
        },
        {
            title: 'System',
            items: [
                {
                    title: 'Settings',
                    icon: Settings,
                    items: [
                        {
                            title: 'Profile',
                            url: '/admin/settings/profile',
                            icon: UserCog,
                        },
                        {
                            title: 'Notifications',
                            url: '/admin/settings/notifications',
                            icon: Bell,
                        },
                        {
                            title: 'Security',
                            url: '/admin/settings/security',
                            icon: Shield,
                        },
                        {
                            title: 'Countries',
                            url: '/admin/settings/countries',
                            icon: Globe,
                        },
                    ],
                },
            ],
        },
    ],
}