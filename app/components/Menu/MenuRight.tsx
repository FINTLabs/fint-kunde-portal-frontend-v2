import { HStack } from '@navikt/ds-react';
import { UserSession } from '~/api/types';
import { LogoutButton } from './LogoutButton';
import { UserOrganization } from './UserOrganization';
import { NavLinkView } from './NavLinkView';

type MenuRightType = {
    userSession: UserSession;
};
export const MenuRight = ({ userSession }: MenuRightType) => (
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
