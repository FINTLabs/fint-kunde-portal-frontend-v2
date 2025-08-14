import { Box, Heading, HGrid, LinkCard, VStack } from '@navikt/ds-react';
import { MetaFunction, useOutletContext } from 'react-router';
import { IUserSession } from '~/types/Session';
import { menuConfig } from '~/components/Menu/MenuConfig';

export const meta: MetaFunction = () => {
    return [
        { title: 'Novari Kundeportalen' },
        {
            name: 'description',
            content:
                'FINT Kundeportal gir enkel styring av tilganger og kontroll over FINT, levert av Novari IKS.',
        },
    ];
};

export default function Index() {
    const userSession = useOutletContext<IUserSession>();

    const hasRole = (roleId: string): boolean => {
        const orgName = userSession.selectedOrganization?.name;
        const roles = userSession.meData?.roles ?? [];

        if (roles.includes(`ROLE_ADMIN@${orgName}`)) {
            return true;
        }

        return roles.includes(`${roleId}@${orgName}`);
    };

    return (
        <Box className="font-sans p-4">
            <VStack gap="6" justify={'center'} align="center">
                <Heading className="pt-8" size="large">
                    Velkommen til kundeportalen, {userSession.meData.firstName}.
                </Heading>

                <HGrid className="pt-4" gap="3" columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}>
                    {menuConfig.flatMap((group) =>
                        group.items.map((item) => (
                            <LinkCard key={item.action} size="medium">
                                {item.icon && (
                                    <LinkCard.Icon
                                        className={
                                            hasRole(item.role)
                                                ? 'panel-icon'
                                                : 'panel-icon panel-icon-disabled'
                                        }>
                                        {item.icon}
                                    </LinkCard.Icon>
                                )}
                                <LinkCard.Title
                                    as="h3"
                                    className={
                                        hasRole(item.role) ? '' : 'panel-description-disabled'
                                    }>
                                    <LinkCard.Anchor href={hasRole(item.role) ? item.action : ''}>
                                        {item.label}
                                    </LinkCard.Anchor>
                                </LinkCard.Title>
                                {item.description && (
                                    <LinkCard.Description>{item.description}</LinkCard.Description>
                                )}
                            </LinkCard>
                        ))
                    )}
                </HGrid>
            </VStack>
        </Box>
    );
}
