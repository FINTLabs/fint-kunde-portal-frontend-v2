import React from 'react';
import { MetaFunction } from '@remix-run/node';
import { ComponentIcon } from '@navikt/aksel-icons';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import { fetchComponentsLoader } from '~/loaders/shared/componentsLoader';
import { useLoaderData } from '@remix-run/react';
import { IComponent } from '~/types/Component';

export const meta: MetaFunction = () => {
    return [
        { title: 'Komponenter' },
        { name: 'description', content: 'Liste over komponenter._index' },
    ];
};

export const loader = fetchComponentsLoader;

export default function Index() {
    const breadcrumbs = [{ name: 'Komponenter', link: '/komponenter' }];

    const { components } = useLoaderData<{ components: IComponent[] }>();
    console.log('components');
    console.log(components);
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Komponenter'} icon={ComponentIcon} helpText="components" />
            <ComponentsTable />
        </>
    );
}
