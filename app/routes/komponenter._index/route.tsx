import { MetaFunction } from '@remix-run/node';
import { ComponentIcon } from '@navikt/aksel-icons';
import React from 'react';
import { json, useLoaderData } from '@remix-run/react';
import ComponentApi from '~/api/ComponentApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import { IComponent } from '~/types/Component';

export const meta: MetaFunction = () => {
    return [
        { title: 'Komponenter' },
        { name: 'description', content: 'Liste over komponenter._index' },
    ];
};

export const loader = async () => {
    try {
        const components = await ComponentApi.getAllComponents();
        return json({ components });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Komponenter', link: '/komponenter' }];
    const { components } = useLoaderData<{ components: IComponent[] }>();

    const selectedCompoents = components
        .filter(
            (component) => component.organisations.some((org) => org.includes('fintlabs')) // TODO: fiks hard coded org name
        )
        .map((component) => component.dn);

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Komponenter'} icon={ComponentIcon} helpText="components" />
            <ComponentsTable components={components} selectedComponents={selectedCompoents} />
        </>
    );
}
