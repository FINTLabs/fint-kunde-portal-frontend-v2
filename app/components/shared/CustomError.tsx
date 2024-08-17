import React from 'react';
import { Box, Heading, Page } from '@navikt/ds-react';

import '@navikt/ds-css';

import Footer from '~/components/Footer';

export function CustomError({ children }: { children: React.ReactNode }) {
    return (
        <Page
            footer={
                <Box background="surface-neutral-moderate" padding="8" as="footer">
                    <Page.Block gutters width="lg">
                        <Footer />
                    </Page.Block>
                </Box>
            }>
            <Box background="surface-neutral-moderate" padding="8" as="header">
                <Page.Block gutters width="lg">
                    <Heading size="large">Error</Heading>
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
