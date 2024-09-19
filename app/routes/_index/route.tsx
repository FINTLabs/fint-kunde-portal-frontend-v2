import { Box, GuidePanel, Heading, HGrid, VStack } from '@navikt/ds-react';
import { json, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useOutletContext } from '@remix-run/react';
import { MENU_ITEMS_LEFT } from '~/components/Menu/constants';
import { MenuDropDown } from '~/types/MenuDropDown';
import { MenuItem } from '~/types/MenuItem';
import { IUserSession } from '~/types/types';
import CustomLinkPanel from '~/routes/_index/CustomLinkPanelProps';
import { ExclamationmarkTriangleIcon, ImageIcon, PassportIcon } from '@navikt/aksel-icons';
import FeaturesApi from '~/api/FeaturesApi';

export const meta: MetaFunction = () => {
    return [
        { title: 'Kundeportalen V2' },
        { name: 'description', content: 'Welcome to the new customer portal!' },
    ];
};

export const loader = async () => {
    const features = await FeaturesApi.fetchFeatures();
    return json({ features });
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
    const { features } = useLoaderData<Record<string, boolean>>();

    return (
        <Box className="font-sans p-4">
            <VStack gap="6" justify={'center'} align="center">
                <GuidePanel
                    illustration={
                        <ExclamationmarkTriangleIcon title="a11y-title" className={'p-2'} />
                    }>
                    ** Dette nettstedet er for øyeblikket under testing. **
                    <br />
                    For å få tilgang til den offisielle versjonen, vennligst besøk vår nettside her:{' '}
                    <Link to={'https://kunde.felleskomponent.no/dashboard'}>Kundeportalen</Link>
                </GuidePanel>
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

                            return (
                                <CustomLinkPanel
                                    key={index}
                                    href={item.path}
                                    title={item.title}
                                    IconComponent={IconComponent}
                                />
                            );
                        })}
                    {features['samtykke-admin-new' as keyof typeof features] && (
                        <CustomLinkPanel
                            href={'/samtykke'}
                            title={'Samtykke'}
                            IconComponent={PassportIcon}
                        />
                    )}
                </HGrid>
            </VStack>
        </Box>
    );
}
