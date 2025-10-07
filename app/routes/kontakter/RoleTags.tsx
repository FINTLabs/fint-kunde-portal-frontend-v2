import { ShieldLockIcon } from '@navikt/aksel-icons';
import { HStack, Tag } from '@navikt/ds-react';
import React from 'react';

import { IContact } from '~/types/Contact';

interface RoleTagsProps {
    contact: IContact;
    hasRole: (contact: IContact, roleId: string) => boolean;
    getUserRolesForOrg: (contact: IContact) => string[];
}

const RoleTags = ({ contact, hasRole, getUserRolesForOrg }: RoleTagsProps) => {
    return (
        <HStack gap="2">
            {hasRole(contact, 'ROLE_ADMIN') ? (
                <Tag variant="warning" size={'xsmall'} icon={<ShieldLockIcon aria-hidden />}>
                    Admin
                </Tag>
            ) : (
                getUserRolesForOrg(contact)
                    .filter((role) => role !== 'ROLE_DASHBOARD' && role !== 'ROLE_SUPPORT')
                    .map((role, index) => (
                        <Tag key={index} variant="info" size={'xsmall'}>
                            {role}
                        </Tag>
                    ))
            )}
        </HStack>
    );
};

export default RoleTags;
