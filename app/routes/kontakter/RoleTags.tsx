import React from 'react';
import { HStack, Tag } from '@navikt/ds-react';
import { ShieldLockIcon } from '@navikt/aksel-icons';
import { IContact } from '~/types/types';

interface RoleTagsProps {
    contact: IContact;
    hasRole: (contact: IContact, roleId: string) => boolean;
    getUserRolesForOrg: (contact: IContact) => string[];
}

const RoleTags: React.FC<RoleTagsProps> = ({ contact, hasRole, getUserRolesForOrg }) => {
    return (
        <HStack gap="2">
            {hasRole(contact, 'ROLE_ADMIN') ? (
                <Tag variant="warning" size={'xsmall'} icon={<ShieldLockIcon aria-hidden />}>
                    Admin
                </Tag>
            ) : (
                getUserRolesForOrg(contact).map((role, index) => (
                    <Tag key={index} variant="info" size={'xsmall'}>
                        {role}
                    </Tag>
                ))
            )}
        </HStack>
    );
};

export default RoleTags;
