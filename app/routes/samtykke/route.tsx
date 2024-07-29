import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { TerminalIcon } from '@navikt/aksel-icons';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import React from 'react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Box, VStack } from '@navikt/ds-react';
import ServiceAccordion from '~/routes/samtykke/ServiceAccordion';
import SearchHeader from '~/routes/samtykke/SearchHeader';
import { getSelectedOprganization } from '~/utils/selectedOrganization';
import { json, useLoaderData } from '@remix-run/react';
import ConsentApi from '~/api/ConsentApi';
import { IComponentConfig } from '~/types/ComponentConfig';
import { IService } from '~/types/Consent';
import { log } from '~/utils/logger';

export const meta: MetaFunction = () => {
    return [{ title: 'Samtykke' }, { name: 'description', content: 'Liste over Samtykke' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOprganization(request);
    const headers = request.headers;
    const cookies = headers.get('cookie');

    try {
        const services = await ConsentApi.getServices(orgName, cookies); // Pass cookies to getServices
        const configs = await ConsentApi.getTest(orgName);
        return json({ services, configs });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Samtykke', link: '/samtykke' }];
    const { services, configs } = useLoaderData<{
        services: IService[];
        configs: IComponentConfig[];
    }>();
    log('consent configs:', configs.length);
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Samtykke'} icon={TerminalIcon} helpText="samtykke" />

            <VStack gap={'6'}>
                {' '}
                <SearchHeader />
                {/*<Box className="w-full" padding="6" borderRadius="large" shadow="small">*/}
                {/*    <HGrid columns={2}>*/}
                {/*        <TextField label="Filtrer på tjenste" size="small" />*/}
                {/*        <Switch>Vis inaktive behandling</Switch>*/}
                {/*    </HGrid>*/}
                {/*</Box>*/}
                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <ServiceAccordion services={services} />
                </Box>
            </VStack>
        </>
    );
}
