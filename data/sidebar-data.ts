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
                    url: '/',
                    icon: LayoutDashboard,
                },
                {
                    title: 'Analytics',
                    url: '/analytics',
                    icon: BarChart3,
                },
            ],
        },
        {
            title: 'Management',
            items: [
                {
                    title: 'Dealers',
                    url: '/dealers',
                    icon: Users,
                },
                {
                    title: 'Clients',
                    url: '/clients',
                    icon: Building2,
                },
                {
                    title: 'Campaigns',
                    url: '/campaigns',
                    icon: Megaphone,
                },
            ],
        },
        {
            title: 'Marketing',
            items: [
                {
                    title: 'SMS Marketing',
                    url: '/marketing/sms',
                    icon: MessageSquare,
                },
                {
                    title: 'Email Marketing',
                    url: '/marketing/email',
                    icon: Mail,
                },
            ],
        },
        {
            title: 'Services',
            items: [
                {
                    title: 'SMS Credits',
                    url: '/sms-credits',
                    icon: MessageSquare,
                },
                {
                    title: 'Billing',
                    url: '/billing',
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
                            url: '/settings/profile',
                            icon: UserCog,
                        },
                        {
                            title: 'Notifications',
                            url: '/settings/notifications',
                            icon: Bell,
                        },
                        {
                            title: 'Security',
                            url: '/settings/security',
                            icon: Shield,
                        },
                        {
                            title: 'Countries',
                            url: '/settings/countries',
                            icon: Globe,
                        },
                    ],
                },
            ],
        },
    ],
}