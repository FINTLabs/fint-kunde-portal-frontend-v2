import { json, type LoaderFunction, type MetaFunction } from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { useParams } from '@remix-run/react';
import adapters from '~/routes/adaptere/adapterList.json';
import { BodyLong, Box } from '@navikt/ds-react';
import { AdapterDetail } from './AdapterDetail';

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter Detaljer' }, { name: 'description', content: 'Adapter Detaljer' }];
};

export default function Index() {
    const { name } = useParams();

    const breadcrumbs = [
        { name: 'Adaptere', link: '/adaptere' },
        { name: `${name}`, link: `/adapter/${name}` },
    ];

    const filteredAdapters = adapters.filter((a) => a.name === name);
    if (filteredAdapters.length > 0) {
    }

    const adapter = filteredAdapters.length > 0 ? filteredAdapters[0] : null;

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={'Adaptere'}
                icon={MigrationIcon}
                helpText="adaptere"
                hideBorder={true}
            />
            {!adapter && (
                <Box padding="4" background="surface-danger-moderate">
                    <BodyLong>
                        Det finnes ingen adapter ved navn <strong>{name}</strong> i listen over
                        adaptere.
                    </BodyLong>
                </Box>
            )}
            {adapter && <AdapterDetail adapter={adapter} />}
        </>
    );
}
