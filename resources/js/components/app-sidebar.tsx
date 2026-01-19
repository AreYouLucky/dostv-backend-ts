import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { BookOpen, Globe, Clapperboard, ImagePlay, Newspaper, MonitorPlay, GalleryHorizontalEnd } from 'lucide-react';
import AppLogo from './app-logo';


const mainNavItems: NavItem[] = [
    {
        title: 'Advertisements',
        href: '/view-advertisements',
        icon: Clapperboard,
    },
    {
        title: 'Banners',
        href: '/view-banners',
        icon: ImagePlay,
    },
    {
        title: 'Categories',
        href: '/view-categories',
        icon: Newspaper,
    },
    {
        title: 'Post',
        href: '/view-posts',
        icon: MonitorPlay,
    },
    {
        title: 'Programs',
        href: '/view-programs',
        icon: GalleryHorizontalEnd,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'About',
        href: 'https://dostv.ph/about/who-we-are',
        icon: BookOpen,
    },
    {
        title: 'Website',
        href: 'https://dostv.ph/',
        icon: Globe,
    },

];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset"  className=' text-white'>
            <SidebarHeader className='mt-4 mb-3'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
