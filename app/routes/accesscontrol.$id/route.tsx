import React, { useState } from 'react';
import { KeyVerticalIcon } from '@navikt/aksel-icons';
import { HStack, VStack } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { LoaderFunction } from '@remix-run/node';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { json, useLoaderData } from '@remix-run/react';
import AccessApi from '~/api/AccessApi';
import { IAccess } from '~/types/Access';

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

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const selectedOrg = await getSelectedOrganization(request);

        const accesses = await AccessApi.getAllAccess(selectedOrg);
        const templates = await AccessApi.getAccessTemplates();

        return json({
            accesses,
            templates,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Tilgangskontroll', link: '/accesscontrol.$id' }];
    const { accesses, templates } = useLoaderData<IPageLoaderData>();
    const [selectedTemplate, setSelectedTemplate] = useState<IAccess | null>(null);

    const isTemplatesArray = Array.isArray(templates);

    const handleSelectTemplate = (template: IAccess) => {
        setSelectedTemplate(template);
    };
    const handleBackClick = () => {
        setSelectedTemplate(null);
    };

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
