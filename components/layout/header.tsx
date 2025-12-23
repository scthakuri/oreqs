'use client'

import {SidebarTrigger} from '@/components/ui/sidebar'
import {Separator} from '@/components/ui/separator'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {ThemeToggle} from './theme-toggle'
import React from 'react'

export interface BreadcrumbItemType {
    label: string
    href?: string
}

interface HeaderProps {
    breadcrumbs?: BreadcrumbItemType[]
}

export function Header({breadcrumbs = [{label: 'Dashboard'}]}: HeaderProps) {
    return (
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
            <div className='flex items-center gap-2'>
                <SidebarTrigger className='-ml-1'/>
                <Separator orientation='vertical' className='h-4'/>
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <BreadcrumbSeparator/>}
                                <BreadcrumbItem>
                                    {index === breadcrumbs.length - 1 || !item.href ? (
                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={item.href}>
                                            {item.label}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className='ml-auto flex items-center gap-2'>
                <ThemeToggle/>
            </div>
        </header>
    )
}
