import { NavLink } from 'react-router';
import { MenuItem } from '~/types/MenuItem';

type NavLinkViewType = {
    item: MenuItem;
};

export const NavLinkView = ({ item }: NavLinkViewType) => {
    return (
        <NavLink
            to={item.path}
            className={({ isActive, isPending }) =>
                `text-[--a-gray-600] hover:text-[--a-gray-200] w-full ${
                    isPending ? 'pending' : isActive ? 'active' : ''
                } `
            }>
            <div className="p-[--a-spacing-3] hover:!bg-[#f8ebdb] hover:text-black w-full">
                {item.title}
            </div>
        </NavLink>
    );
};
