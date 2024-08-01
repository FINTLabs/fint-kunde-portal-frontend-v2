import { Box, HGrid } from '@navikt/ds-react';
import type { MetaFunction } from '@remix-run/node';
import { Link, NavLink, useOutletContext } from '@remix-run/react';
import { MENU_ITEMS_LEFT } from '~/components/Menu/constants';
import { MenuDropDown } from '~/types/MenuDropDown';
import { MenuItem } from '~/types/MenuItem';
import { IUserSession } from '~/types/types';
import { log } from '~/utils/logger';

export const meta: MetaFunction = () => {
    return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
    const userSession = useOutletContext<IUserSession>();

    let original: MenuItem[] = [];
    log('userSession', userSession);
    return (
        <div className="font-sans p-4">
            <h1 className="text-3xl">
                Welcome to Kunde Portalen, {userSession.firstName}. You are part of{' '}
                {userSession.organizationCount} organization(s)
                <HGrid className="pt-4" gap="3" columns={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}>
                    {MENU_ITEMS_LEFT.dropdowns
                        .reduce(
                            (acc: MenuItem[], curr: MenuDropDown) => [...acc, ...curr.subMenus],
                            []
                        )
                        .map((item, index) => (
                            <Link key={index} to={item.path}>
                                <Box padding="10" borderRadius={'medium'} borderWidth="1">
                                    {item.title}
                                </Box>
                            </Link>
                        ))}
                </HGrid>
            </h1>
        </div>
    );
}
