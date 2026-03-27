import { Box, Page } from '@navikt/ds-react';
import { NovariFooter } from 'novari-frontend-components';
import React from 'react';

import '@navikt/ds-css';

import { Logo } from '~/components/Menu/Logo';
import { footerLinksNotLoggedIn } from '~/components/Menu/MenuConfig';

export function CustomErrorLayout({ children }: { children: React.ReactNode }) {
    return (
        <Page
            footer={
                <Box padding="space-2" as="footer" className={'novari-footer'}>
                    <Page.Block gutters width="lg">
                        <NovariFooter links={footerLinksNotLoggedIn} />
                    </Page.Block>
                </Box>
            }>
            <Box as="header" className={'novari-header'}>
                <Page.Block gutters width="lg" className={'pt-5 pb-5'}>
                    <Logo />
                    {/*<Heading size="large">Error</Heading>*/}
                </Page.Block>
            </Box>
            {/*<Box padding="space-8" paddingBlock="space-2" as="main">*/}
            <Page.Block as="main" width="xl" gutters>
                {children}
            </Page.Block>
            {/*</Box>*/}
        </Page>
    );
}
