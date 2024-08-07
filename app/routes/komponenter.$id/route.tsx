import React, { useState } from 'react';
import { json, useLoaderData, useNavigate } from '@remix-run/react';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowLeftIcon, ComponentIcon, PencilIcon } from '@navikt/aksel-icons';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Box, Button, Heading, HGrid, HStack, Spacer } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import ComponentApi from '~/api/ComponentApi';
import ComponentDetails from '~/routes/komponenter.$id/ComponentDetails';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import EndpointTable from '~/routes/komponenter.$id/EndpointTable';
import SwaggerTable from '~/routes/komponenter.$id/SwaggerTable';
import ComponentEdit from '~/routes/komponenter.$id/ComponentEdit';
import OrganisationApi from '~/api/OrganisationApi';
import { getFormData } from '~/utils/requestUtils';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

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
    const component = useLoaderData<IComponent>();
    const breadcrumbs = [
        { name: 'Komponenter', link: '/komponenter' },
        { name: component.name, link: `/komponenter/${component.name}` },
    ];
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    function handleCloseEdit() {
        setIsEditing(false);
    }
    console.log(component);

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={component.description} icon={ComponentIcon} />

            <HGrid columns="50px auto">
                <Box>
                    <Button
                        icon={<ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />}
                        variant="tertiary"
                        onClick={() => navigate(`/komponenter`)}></Button>
                </Box>

                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <HStack gap={'1'}>
                        <Heading size={'medium'}>Details</Heading>
                        <Spacer />
                        {!isEditing && (
                            <Button
                                icon={<PencilIcon title="Rediger" />}
                                variant="tertiary"
                                onClick={() => setIsEditing(true)}
                            />
                        )}
                    </HStack>

                    {!isEditing ? (
                        <ComponentDetails component={component} />
                    ) : (
                        <ComponentEdit component={component} onClose={handleCloseEdit} />
                    )}

                    <Divider className="pt-3" />

                    <Heading size={'medium'}>Endepunkter</Heading>
                    <Box padding="4">
                        <EndpointTable component={component} />
                    </Box>
                    <Heading size={'medium'}>Swagger</Heading>

                    <Box padding="4">
                        <SwaggerTable component={component} />
                    </Box>
                </Box>
            </HGrid>
        </>
    );
}
