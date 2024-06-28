import { Box, Page } from '@navikt/ds-react';
import { PersonGroupIcon } from '@navikt/aksel-icons';
import { Outlet, useOutletContext } from '@remix-run/react';
import Breadcrumbs from '~/components/breadcrumbs';
import InternalPageHeader from '~/components/InternalPageHeader';
import { UserSession } from '~/api/types';

export default function Index() {
    const breadcrumbs = [{ name: 'Test Page', link: '/test' }];

    const userSession = useOutletContext<UserSession>();

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
                    <Outlet context={userSession} />
                </Page.Block>
            </Box>
        </>
    );
}
