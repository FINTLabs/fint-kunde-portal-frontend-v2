import type { MetaFunction } from '@remix-run/node';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { TerminalIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Box } from '@navikt/ds-react';
import TestCreateForm from '~/routes/basistest/TestCreateForm';

export const meta: MetaFunction = () => {
    return [
        { title: 'Hendelseslogg' },
        { name: 'description', content: 'Liste over hendelseslogg' },
    ];
};

export default function Index() {
    const breadcrumbs = [{ name: 'Kontakter', link: '/kontakter' }];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Basistest'} icon={TerminalIcon} helpText="basistest" />
            <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                <TestCreateForm />
            </Box>
        </>
    );
}
