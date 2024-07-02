import {Box, Page} from '@navikt/ds-react';
import {PersonGroupIcon} from '@navikt/aksel-icons';
import Breadcrumbs from '~/components/breadcrumbs';
import InternalPageHeader from '~/components/InternalPageHeader';

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
