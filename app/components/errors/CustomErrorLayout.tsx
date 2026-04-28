import { Box, Page } from '@navikt/ds-react';
import { NovariFooter, NovariHeader } from 'novari-frontend-components';
import React from 'react';
import { useTranslation } from 'react-i18next';

import '@navikt/ds-css';
import { getFooterLinksNotLoggedIn } from '~/components/Menu/MenuConfig';

export function CustomErrorLayout({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();

    return (
        <Page
            footer={
                <Box padding="space-2" as="footer" className={'novari-footer'}>
                    <Page.Block gutters width="lg">
                        <NovariFooter links={getFooterLinksNotLoggedIn(t)} />
                    </Page.Block>
                </Box>
            }>
            <Box as="header" className={'novari-header'}>
                <Page.Block gutters width="lg" className={'pt-5 pb-5'}>
                    <NovariHeader
                        isLoggedIn={true}
                        // appName={'FINT Kunde Portal'}
                        menu={[]}
                        showLogoWithTitle={true}
                        displayName={'Error'}
                        onLogout={() =>
                            (window.location.href =
                                'https://idp.felleskomponent.no/nidp/app/logout')
                        }
                        onMenuClick={() => {}}
                        appName={t('root.appName')}
                        onLogin={() => {}}
                    />
                </Page.Block>
            </Box>
            {/*<Box padding="space-8" paddingBlock="space-2" as="main">*/}
            <Page.Block as="main" width="xl" gutters>
                <Box paddingBlock={'space-32'} paddingInline={'space-32'}>
                    {children}
                </Box>
            </Page.Block>
            {/*</Box>*/}
        </Page>
    );
}
