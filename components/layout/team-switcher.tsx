import * as React from 'react'
import {ChevronsUpDown, Globe, Plus} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'

const countries = [
    {code: 'US', name: 'United States', flag: '🇺🇸', domain: 'oreqs.us'},
    {code: 'UK', name: 'United Kingdom', flag: '🇬🇧', domain: 'oreqs.uk'},
    {code: 'AU', name: 'Australia', flag: '🇦🇺', domain: 'oreqs.au'},
    {code: 'NP', name: 'Nepal', flag: '🇳🇵', domain: 'oreqs.com.np'},
]

type Team = {
    code: string;
    name: string;
    flag: string;
    domain: string;
}

type TeamSwitcherProps = {
    teams?: Team[]
}

export function TeamSwitcher({teams}: TeamSwitcherProps) {
    const {isMobile} = useSidebar()
    const [activeCountry, setActiveCountry] = React.useState(countries[0])

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size='lg'
                            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                        >
                            <div
                                className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                                <Globe className='size-4'/>
                            </div>
                            <div className='grid flex-1 text-start text-sm leading-tight'>
                                <span className='truncate font-semibold'>
                                  {activeCountry.name}
                                </span>
                                <span className='truncate text-xs'>{activeCountry.domain}</span>
                            </div>
                            <ChevronsUpDown className='ms-auto'/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                        align='start'
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className='text-xs text-muted-foreground'>
                            Select Country
                        </DropdownMenuLabel>
                        {countries.map((country) => (
                            <DropdownMenuItem
                                key={country.code}
                                onClick={() => setActiveCountry(country)}
                                className='gap-2 p-2'
                            >
                                <div className='flex size-6 items-center justify-center text-lg'>
                                    {country.flag}
                                </div>
                                <div className='flex flex-col'>
                                    <span className='font-medium'>{country.name}</span>
                                    <span className='text-xs text-muted-foreground'>{country.domain}</span>
                                </div>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className='gap-2 p-2'>
                            <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                                <Plus className='size-4'/>
                            </div>
                            <div className='font-medium text-muted-foreground'>Add Country</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}