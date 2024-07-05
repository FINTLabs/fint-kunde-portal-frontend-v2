import React from 'react';
import { Box, Page } from '@navikt/ds-react';

import '@navikt/ds-css';

import Footer from '~/components/Footer';

export function CustomError({ error }: { error: Error }) {
    //TODO: Made this page prettier
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
                    <h1>Error</h1>
                </Page.Block>
            </Box>
            <Box padding="8" paddingBlock="2" as="main">
                <Page.Block gutters width="lg">
                    <p>Something went wrong!</p>
                    <p>{error?.message}</p>
                </Page.Block>
            </Box>
        </Page>
    );
}
