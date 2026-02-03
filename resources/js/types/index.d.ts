import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    user_id: number | null;
    name: string;
    email?: string | null;
    avatar?: string ;
    role?: string;
    email_verified_at?: string | null;
    two_factor_enabled?: boolean;
    created_at?: string|null;
    updated_at?: string| null;
    [key: string]: unknown; // This allows for additional properties...
}
