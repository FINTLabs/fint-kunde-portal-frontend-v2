import { ComponentIcon } from '@navikt/aksel-icons';
import { Box, Heading, HStack, Spacer, VStack } from '@navikt/ds-react';
import { type LoaderFunctionArgs, useLoaderData } from 'react-router';

import ComponentApi from '~/api/ComponentApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ComponentDetails from '~/routes/komponenter.$id/ComponentDetails';
import EndpointTable from '~/routes/komponenter.$id/EndpointTable';
import SwaggerTable from '~/routes/komponenter.$id/SwaggerTable';
import { IComponent } from '~/types/Component';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const id = params.id || '';

    const component = await ComponentApi.getComponentById(id);

    return Response.json(component);
};

export default function Index() {
    const component = useLoaderData<IComponent>();
    // const [searchParams] = useSearchParams();
    // const fromAdapter = searchParams.get('fromAdapter');
    const breadcrumbs = [
        { name: 'Komponenter', link: '/komponenter' },
        { name: component.name, link: `/komponenter/${component.name}` },
    ];
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
            <InternalPageHeader title={component.description} icon={ComponentIcon} />

            {/*<HGrid gap="2" align={'start'}>*/}
            {/*<Box>*/}
            {/*    <Button*/}
            {/*        className="relative h-12 w-12 top-2 right-14"*/}
            {/*        icon={<ArrowLeftIcon title="ArrowLeftIcon" fontSize="1.5rem" />}*/}
            {/*        variant="tertiary"*/}
            {/*        onClick={handleBack}></Button>*/}
            {/*</Box>*/}
            <VStack gap={'2'}>
                <Box
                    // className="w-full relative bottom-12"
                    padding="6"
                    borderRadius="large"
                    shadow="small">
                    <HStack gap={'1'}>
                        <Heading size={'medium'}>Detaljer</Heading>
                        <Spacer />
                    </HStack>

                    <ComponentDetails component={component} />
                </Box>
                <Box
                    // className="w-full relative bottom-12"
                    padding="6"
                    borderRadius="large"
                    shadow="small">
                    <Heading size={'medium'}>Endepunkter</Heading>
                    <Box padding="4">
                        <EndpointTable component={component} />
                    </Box>
                </Box>
                <Box
                    // className="w-full relative bottom-12"
                    padding="6"
                    borderRadius="large"
                    shadow="small">
                    <Heading size={'medium'}>Swagger</Heading>

                    <Box padding="4">
                        <SwaggerTable component={component} />
                    </Box>
                </Box>
            </VStack>
            {/*</HGrid>*/}
        </>
    );
}
