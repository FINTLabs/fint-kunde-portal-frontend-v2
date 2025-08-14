// src/types/Menu.ts
import type { ReactNode } from 'react';

export interface MenuItem {
    label: string;
    action: string;
    icon?: ReactNode;
    description?: string;
    role: string;
}

export interface MenuGroup {
    label: string;
    items: MenuItem[];
}
