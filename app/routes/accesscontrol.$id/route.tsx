import React from 'react';
import { KeyVerticalIcon } from '@navikt/aksel-icons';
import { HStack, VStack } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { LoaderFunctionArgs } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import { IAccess } from '~/types/Access';
import ComponentApi from '~/api/ComponentApi';
import { IComponent } from '~/types/Component';

interface IPageLoaderData {
    templates?: IAccess[] | string;
    accesses?: IAccess[] | string;
    error?: string;
}

export const meta = () => {
    return [
        { title: 'Tilgangskontroll' },
        { name: 'description', content: 'Liste over Tilgangskontroll' },
    ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const id = params.id || '';
    try {
        const component = await ComponentApi.getComponentById(id);
        return json(component);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Tilgangskontroll', link: '/accesscontrol.$id' }];
    const component = useLoaderData<IComponent>();

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader
                        title={'Tilgangskontroll'}
                        icon={KeyVerticalIcon}
                        helpText="tilgangspakker"
                    />
                </VStack>
            </HStack>
        </>
    );
}
