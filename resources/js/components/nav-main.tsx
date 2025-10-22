import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid} from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-3">
            <SidebarMenu >
                <SidebarMenuItem >
                    <SidebarMenuButton
                        asChild
                        isActive={page.url.startsWith(
                            resolveUrl('/dashboard'),
                        )}
                        tooltip={{ children: 'Dashboard' }}
                    >
                        <Link href='/dashboard' prefetch>
                            <LayoutGrid />
                            <span className='text-[12.5px]'>Dashboard</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <SidebarGroupLabel className='mt-4 text-[12px] py-2 text-gray-400'>Content Management</SidebarGroupLabel>
            <SidebarMenu >
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(
                                resolveUrl(item.href),
                            )}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span className='text-[12.5px]'>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
