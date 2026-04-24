import { ComponentIcon } from '@navikt/aksel-icons';
import { Box, Heading, LocalAlert, VStack } from '@navikt/ds-react';
import { type LoaderFunctionArgs, useLoaderData } from 'react-router';

import ComponentApi from '~/api/ComponentApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import ComponentDetails from '~/routes/komponenter.$id/ComponentDetails';
import EndpointTable from '~/routes/komponenter.$id/EndpointTable';
import SwaggerTable from '~/routes/komponenter.$id/SwaggerTable';
import { IComponent } from '~/types/Component';
import { InternalPageHeader } from '~/components/shared/InternalPageHeader';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const id = params.id || '';

    const component = await ComponentApi.getComponentById(id);

    return Response.json(component);
};

export const handle = {
    analytics: {
        pageType: 'komponenter',
        pathPattern: '/komponenter/:id',
    },
};

export default function Index() {
    const component = useLoaderData<IComponent | null>();
    // const [searchParams] = useSearchParams();
    // const fromAdapter = searchParams.get('fromAdapter');
    const breadcrumbs = component
        ? [
              { name: 'Komponenter', link: '/komponenter' },
              { name: component.name, link: `/komponenter/${component.name}` },
          ]
        : [{ name: 'Komponenter', link: '/komponenter' }];
    // const navigate = useNavigate();

    // const handleBack = () => {
    //     if (fromAdapter) {
    //         navigate(`/adapter/${fromAdapter}`);
    //     } else {
    //         navigate(`/komponenter`);
    //     }
    // };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            {component ? (
                <InternalPageHeader title={component.description} icon={ComponentIcon} />
            ) : (
                <InternalPageHeader title="Komponent" icon={ComponentIcon} />
            )}

            {component ? (
                <VStack gap={'space-16'}>
                    <Box
                        padding="space-16"
                        borderColor="neutral-subtle"
                        borderWidth="2"
                        borderRadius="12">
                        <Heading size={'medium'}>Detaljer</Heading>

                        <ComponentDetails component={component} />
                    </Box>
                    <Box
                        padding="space-24"
                        borderColor="neutral-subtle"
                        borderWidth="2"
                        borderRadius="12">
                        <Heading size={'medium'}>Endepunkter</Heading>
                        <Box padding="space-4">
                            <EndpointTable component={component} />
                        </Box>
                    </Box>
                    <Box
                        padding="space-24"
                        borderColor="neutral-subtle"
                        borderWidth="2"
                        borderRadius="12">
                        <Heading size={'medium'}>Swagger</Heading>

                        <Box padding="space-4">
                            <SwaggerTable component={component} />
                        </Box>
                    </Box>
                </VStack>
            ) : (
                <LocalAlert status="warning">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Komponent ikke funnet</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>Kunne ikke laste komponentdetaljer.</LocalAlert.Content>
                </LocalAlert>
            )}
        </>
    );
}
