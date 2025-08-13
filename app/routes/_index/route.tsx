import { Box, Heading, HGrid, VStack } from '@navikt/ds-react';
import { MetaFunction } from 'react-router';
import { useOutletContext } from 'react-router';
import { MENU_ITEMS_LEFT } from '~/components/Menu/constants';
import { MenuDropDown } from '~/types/MenuDropDown';
import { MenuItem } from '~/types/MenuItem';
import CustomLinkPanel from '~/routes/_index/CustomLinkPanelProps';
import { ImageIcon, PassportIcon } from '@navikt/aksel-icons';
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
        // logger.silly('checking for a role: ', userSession.selectedOrganization?.name, roleId);
        return (
            userSession.meData?.roles?.includes(
                roleId + '@' + userSession.selectedOrganization?.name
            ) ?? false
        );
    };

    return (
        <Box className="font-sans p-4">
            <VStack gap="6" justify={'center'} align="center">
                <Heading className="pt-8" size="large">
                    Velkommen til kundeportalen, {userSession.meData.firstName}.
                </Heading>

                <HGrid className="pt-4" gap="3" columns={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}>
                    {MENU_ITEMS_LEFT.dropdowns
                        .reduce(
                            (acc: MenuItem[], curr: MenuDropDown) => [...acc, ...curr.subMenus],
                            []
                        )
                        .map((item, index) => {
                            const IconComponent = item.icon || ImageIcon;
                            const userHasRole =
                                hasRole('ROLE_ADMIN') || (!!item.role && hasRole(item.role));

                            return (
                                <CustomLinkPanel
                                    key={index}
                                    href={item.path}
                                    title={item.title}
                                    IconComponent={IconComponent}
                                    userHasRole={userHasRole}
                                />
                            );
                        })}
                    {userSession.features[
                        'samtykke-admin-new' as keyof typeof userSession.features
                    ] && (
                        <CustomLinkPanel
                            href={'/samtykke'}
                            title={'Samtykke'}
                            IconComponent={PassportIcon}
                            userHasRole={true}
                        />
                    )}
                </HGrid>
            </VStack>
        </Box>
    );
}
