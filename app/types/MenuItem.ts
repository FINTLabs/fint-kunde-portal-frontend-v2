// src/types/Menu.ts
import type { ReactNode } from 'react';

export interface IMenuItem {
    label: string;
    action: string;
    icon?: ReactNode;
    description?: string;
    role: string;
    displayBox?: boolean;
}

export interface IMenuGroup {
    label: string;
    items: IMenuItem[];
}

export type IMenuDropDown = {
    title: string;
    subMenus: IMenuItem[];
};
