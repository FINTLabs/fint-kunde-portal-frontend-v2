import { Box, Heading, HGrid, LinkCard, VStack } from '@navikt/ds-react';
import { MetaFunction, useOutletContext } from 'react-router';

import { novariMenu } from '~/components/Menu/MenuConfig';
import { IUserSession } from '~/types/Session';

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
                    {/*{userSession.selectedOrganization?.name == 'calvin_organizations' && (*/}
                    {/*    <>*/}
                    {/*        <LinkCard key="fintlabs_no" size="small">*/}
                    {/*            <LinkCard.Title as="h3">*/}
                    {/*                <LinkCard.Anchor href="https://core-status.fintlabs.no/">*/}
                    {/*                    Status Service*/}
                    {/*                </LinkCard.Anchor>*/}
                    {/*            </LinkCard.Title>*/}
                    {/*        </LinkCard>*/}
                    {/*        <LinkCard key="fintlabs_no" size="small">*/}
                    {/*            <LinkCard.Title as="h3">*/}
                    {/*                <LinkCard.Anchor href="https://admin.fintlabs.no/">*/}
                    {/*                    Admin Portal*/}
                    {/*                </LinkCard.Anchor>*/}
                    {/*            </LinkCard.Title>*/}
                    {/*        </LinkCard>*/}
                    {/*    </>*/}
                    {/*)}*/}
                    {novariMenu.flatMap((menuItem) => {
                        if (menuItem.action && !menuItem.submenu) {
                            if (menuItem.displayBox === false) {
                                return null;
                            }

                            return (
                                <LinkCard key={menuItem.action} size="medium">
                                    {/* No icon property on menuItem, so do not render icon */}
                                    <LinkCard.Title as="h3">
                                        <LinkCard.Anchor href={menuItem.action}>
                                            {menuItem.label}
                                        </LinkCard.Anchor>
                                    </LinkCard.Title>
                                    {menuItem.description && (
                                        <LinkCard.Description className="panel-description">
                                            {menuItem.description}
                                        </LinkCard.Description>
                                    )}
                                </LinkCard>
                            );
                        }

                        // Handle submenu items
                        if (menuItem.submenu) {
                            return menuItem.submenu
                                .filter(
                                    (item) => item.role && hasRole(item.role)
                                    // && (item.displayBox === null || item.displayBox !== false)
                                )
                                .map((item) => (
                                    <LinkCard key={item.action} size="medium">
                                        {item.icon && (
                                            <LinkCard.Icon className="panel-icon">
                                                {item.icon}
                                            </LinkCard.Icon>
                                        )}
                                        <LinkCard.Title as="h3">
                                            <LinkCard.Anchor href={item.action}>
                                                {item.label}
                                            </LinkCard.Anchor>
                                        </LinkCard.Title>
                                        {item.description && (
                                            <LinkCard.Description className="panel-description">
                                                {item.description}
                                            </LinkCard.Description>
                                        )}
                                    </LinkCard>
                                ));
                        }

                        return [];
                    })}
                </HGrid>
            </VStack>
        </Box>
    );
}
