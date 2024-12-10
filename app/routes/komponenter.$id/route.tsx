import { useLoaderData, useNavigate } from '@remix-run/react';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowLeftIcon, ComponentIcon } from '@navikt/aksel-icons';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Box, Button, Heading, HGrid, HStack, Spacer } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import ComponentApi from '~/api/ComponentApi';
import ComponentDetails from '~/routes/komponenter.$id/ComponentDetails';
import { LoaderFunctionArgs } from '@remix-run/node';
import EndpointTable from '~/routes/komponenter.$id/EndpointTable';
import SwaggerTable from '~/routes/komponenter.$id/SwaggerTable';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const id = params.id || '';

    const component = await ComponentApi.getComponentById(id);

    return new Response(JSON.stringify(component), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export default function Index() {
    const component = useLoaderData<IComponent>();
    const breadcrumbs = [
        { name: 'Komponenter', link: '/komponenter' },
        { name: component.name, link: `/komponenter/${component.name}` },
    ];
    const navigate = useNavigate();

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={component.description} icon={ComponentIcon} />

            <HGrid gap="2" align={'start'}>
                <Box>
                    <Button
                        className="relative h-12 w-12 top-2 right-14"
                        icon={<ArrowLeftIcon title="ArrowLeftIcon" fontSize="1.5rem" />}
                        variant="tertiary"
                        onClick={() => navigate(`/komponenter`)}></Button>
                </Box>

                <Box
                    className="w-full relative bottom-12"
                    padding="6"
                    borderRadius="large"
                    shadow="small">
                    <HStack gap={'1'}>
                        <Heading size={'medium'}>Detaljer</Heading>
                        <Spacer />
                    </HStack>

                    <ComponentDetails component={component} />

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
