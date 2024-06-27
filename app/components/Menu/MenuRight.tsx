import { HStack } from '@navikt/ds-react';
import { UserSession } from '~/api/types';
import { LogoutButton } from './LogoutButton';
import { UserOrganization } from './UserOrganization';

type MenuRightType = {
    userSession: UserSession;
};
export const MenuRight = ({ userSession }: MenuRightType) => (
    <HStack gap="5">
        <div className="flex items-center">
            <UserOrganization userSession={userSession} />
        </div>
        <div className="flex items-center">{userSession.firstName}</div>
        <div className="flex items-center">
            <LogoutButton />
        </div>
    </HStack>
);
