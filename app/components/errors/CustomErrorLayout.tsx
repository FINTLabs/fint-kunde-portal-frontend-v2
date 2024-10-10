import React from 'react';
import { Box, Page } from '@navikt/ds-react';

import '@navikt/ds-css';

import Footer from '~/components/Footer';
import { Logo } from '~/components/Menu/Logo';

export function CustomErrorLayout({ children }: { children: React.ReactNode }) {
    return (
        <Page
            footer={
                <Box background="surface-neutral-moderate" padding="8" as="footer">
                    <Page.Block gutters width="lg">
                        <Footer />
                    </Page.Block>
                </Box>
            }>
            <Box background="bg-subtle" padding="8" as="header">
                <Page.Block gutters width="lg">
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
