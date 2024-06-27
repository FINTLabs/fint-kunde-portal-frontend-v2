import { NavLink } from '@remix-run/react';
import { MenuItem } from '~/types/MenuItem';

export const NavLinkView = ({ item }: { item: MenuItem }) => {
    return (
        <NavLink
            to={item.path}
            className={({ isActive, isPending }) =>
                `text-[--a-gray-600] hover:text-[--a-gray-200] w-full ${
                    isPending ? 'pending' : isActive ? 'active' : ''
                }`
            }>
            <div className="p-[--a-spacing-3] hover:bg-[--a-lightblue-600] hover:text-[--a-gray-50] w-full">
                {item.title}
            </div>
        </NavLink>
    );
};
