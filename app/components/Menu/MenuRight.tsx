import { HStack } from '@navikt/ds-react';
import { IUserSession } from '~/types/types';
import { LogoutButton } from './LogoutButton';
import { UserOrganization } from './UserOrganization';
import { NavLinkView } from './NavLinkView';
import { log } from '~/utils/logger';

type MenuRightType = {
    userSession: IUserSession;
};
export const MenuRight = ({ userSession }: MenuRightType) => {
    return (
        <HStack gap="5">
            <div className="flex items-center">
                <UserOrganization userSession={userSession} />
            </div>
            <div className="flex items-center">
                <NavLinkView
                    item={{
                        title: userSession.firstName,
                        path: '/user',
                    }}></NavLinkView>
            </div>
            <div className="flex items-center">
                <LogoutButton />
            </div>
        </HStack>
    );
};
