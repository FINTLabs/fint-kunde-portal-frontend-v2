import { Box, Page } from '@navikt/ds-react';
import { PersonGroupIcon } from '@navikt/aksel-icons';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';

export default function Index() {
    const breadcrumbs = [{ name: 'Test Page', link: '/test' }];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Test with a Kontakter icon'}
                icon={PersonGroupIcon}
                helpText="contacts"
            />
            <Box
                // background="surface-alt-4-moderate"
                padding="8"
                paddingBlock="16">
                <Page.Block gutters width="lg">
                    hold
                </Page.Block>
            </Box>
        </>
    );
}
