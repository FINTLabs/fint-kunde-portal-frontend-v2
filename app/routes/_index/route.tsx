import { Box, Heading, HGrid, Loader, VStack } from '@navikt/ds-react';
import type { MetaFunction } from '@remix-run/node';
import { useOutletContext } from '@remix-run/react';
import { useState } from 'react';
import { MENU_ITEMS_LEFT } from '~/components/Menu/constants';
import { MenuDropDown } from '~/types/MenuDropDown';
import { MenuItem } from '~/types/MenuItem';
import { IUserSession } from '~/types/types';
import { log } from '~/utils/logger';
import CustomLinkPanel from '~/routes/_index/CustomLinkPanelProps';
import { ImageIcon } from '@navikt/aksel-icons';

export const meta: MetaFunction = () => {
    return [
        { title: 'Kundeportalen V2' },
        { name: 'description', content: 'Welcome to the new customer portal!' },
    ];
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

    log('userSession', userSession);
    const [loading, setLoading] = useState(false);

    return (
        <Box className="font-sans p-4">
            <VStack gap="6" justify={'center'} align="center">
                <WelcomeMessage userSession={userSession}></WelcomeMessage>

                {loading && (
                    <Box padding="32">
                        <Loader size="3xlarge" title="Venter..." />
                    </Box>
                )}
                {!loading && (
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

                        {/*<CustomLinkPanel*/}
                        {/*    href={'/samtykke'}*/}
                        {/*    title={'Samtykke'}*/}
                        {/*    IconComponent={TerminalIcon}*/}
                        {/*/> TODO: only show if they have permission */}
                    </HGrid>
                )}
            </VStack>
        </Box>
    );
}
