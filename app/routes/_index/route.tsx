import { Box, Heading, HGrid, VStack } from '@navikt/ds-react';
import { json, MetaFunction } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import { MENU_ITEMS_LEFT } from '~/components/Menu/constants';
import { MenuDropDown } from '~/types/MenuDropDown';
import { MenuItem } from '~/types/MenuItem';
import { IMeData, IUserSession } from '~/types/types';
import CustomLinkPanel from '~/routes/_index/CustomLinkPanelProps';
import { ImageIcon, PassportIcon } from '@navikt/aksel-icons';
import FeaturesApi from '~/api/FeaturesApi';
import MeApi from '~/api/MeApi';

export const meta: MetaFunction = () => {
    return [
        { title: 'Kundeportalen V2' },
        { name: 'description', content: 'Welcome to the new customer portal!' },
    ];
};

export const loader = async () => {
    const features = await FeaturesApi.fetchFeatures();
    const user = await MeApi.fetchMe();

    return json({ features, user });
};

function WelcomeMessage({ userSession }: { userSession: IUserSession }) {
    return (
        <>
            <Heading className="pt-8" size="large">
                Velkommen til kundeportalen, {userSession.firstName}.
            </Heading>
            {/* <BodyShort>Du tilhører en {userSession.organizationCount}</BodyShort> */}
        </>
    );
}

export default function Index() {
    const userSession = useOutletContext<IUserSession>();

    const { features, user } = useLoaderData<{
        features: Record<string, boolean>;
        user: IMeData;
    }>();

    const hasRole = (roleId: string): boolean => {
        return (
            user?.roles?.includes(roleId + '@' + userSession.selectedOrganization?.name) ?? false
        );
    };

    return (
        <Box className="font-sans p-4">
            <VStack gap="6" justify={'center'} align="center">
                <WelcomeMessage userSession={userSession}></WelcomeMessage>

                {/*{loading && (*/}
                {/*    <Box padding="32">*/}
                {/*        <Loader size="3xlarge" title="Venter..." />*/}
                {/*    </Box>*/}
                {/*)}*/}
                {/*{!loading && (*/}
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
                    {features['samtykke-admin-new' as keyof typeof features] && (
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
