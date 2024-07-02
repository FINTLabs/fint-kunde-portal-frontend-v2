import type { MetaFunction } from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter' }, { name: 'description', content: 'Liste over adapter' }];
};

export default function Index() {
    const breadcrumbs = [{ name: 'Adapter', link: '/adapter' }];

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Adapter'} icon={MigrationIcon} helpText="adapter" />
        </>
    );
}
