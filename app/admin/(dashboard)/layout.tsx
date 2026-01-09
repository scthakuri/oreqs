"use client";

import {LayoutProvider} from "@/context/layout-provider";
import {ThemeProvider} from "@/context/theme-provider";
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar'
import React from "react";
import {getCookie} from "@/lib/cookies";
import {AppSidebar} from "@/components/layout/app-sidebar";
import {Header} from "@/components/layout/header";
import {Toaster} from "@/components/ui/sonner";
import {cn} from "@/lib/utils";
import {ProtectedRoute} from "@/components/auth/protected-route";

const Layout = ({children}: { children: React.ReactNode }) => {
    const defaultOpen = getCookie('sidebar_state') !== 'false'

    return (
        <ProtectedRoute>
            <ThemeProvider>
                <LayoutProvider>
                    <SidebarProvider defaultOpen={defaultOpen}>
                        <AppSidebar/>
                        <SidebarInset
                            className={cn(
                                '@container/content',
                                'has-data-[layout=fixed]:h-svh',
                                'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
                            )}
                        >
                            <Header/>
                            <div className='flex flex-1 flex-col gap-4 p-4'>
                                {children}
                            </div>
                        </SidebarInset>
                    </SidebarProvider>
                    <Toaster />
                </LayoutProvider>
            </ThemeProvider>
        </ProtectedRoute>
    )
};

export default Layout;