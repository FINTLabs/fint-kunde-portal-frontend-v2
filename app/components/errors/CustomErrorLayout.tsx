import React from 'react';
import { Box, Page } from '@navikt/ds-react';

import '@navikt/ds-css';

import Footer from '~/components/Footer';
import { Logo } from '~/components/Menu/Logo';

export function CustomErrorLayout({ children }: { children: React.ReactNode }) {
    return (
        <Page
            footer={
                <Box padding="1" as="footer" className={'novari-footer'}>
                    <Page.Block gutters width="lg">
                        <Footer />
                    </Page.Block>
                </Box>
            }>
            <Box as="header" className={'novari-header'}>
                <Page.Block gutters width="lg" className={'pt-5 pb-5'}>
                    <Logo />
                    {/*<Heading size="large">Error</Heading>*/}
                </Page.Block>
            </Box>
            <Box padding="8" paddingBlock="2" as="main">
                <Page.Block gutters width="lg">
                    {children}
                </Page.Block>
            </Box>
        </Page>
    );
}
