'use client';

import {useLayout} from '@/context/layout-provider';
import {useAuth} from '@/context/auth-provider';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail, useSidebar,
} from '@/components/ui/sidebar';
import {NavGroup} from '@/components/layout/nav-group';
import {NavUser} from '@/components/layout/nav-user';
import {TeamSwitcher} from '@/components/layout/team-switcher';
import {getSidebarMenu} from '@/lib/sidebar-menu';
import {usePathname} from "next/navigation";
import {useEffect} from "react";

export function AppSidebar() {
    const {collapsible, variant} = useLayout();
    const {user} = useAuth();
    const {open, setOpen} = useSidebar()
    const pathname = usePathname();

    const navGroups = getSidebarMenu(user);

    useEffect(() => {
        const campaignEditRegex = /^\/admin\/campaigns\/[^/]+\/edit$/;
        const shouldBeClosed = campaignEditRegex.test(pathname);

        if (shouldBeClosed && open) {
            setOpen(false);
        } else if (!shouldBeClosed && !open) {
            setOpen(true);
        }
    }, [pathname, open, setOpen]);

    return (
        <Sidebar collapsible={collapsible} variant={variant}>
            <SidebarHeader>
                <TeamSwitcher teams={[]}/>
            </SidebarHeader>
            <SidebarContent>
                {navGroups.map((props) => (
                    <NavGroup key={props.title} {...props} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}