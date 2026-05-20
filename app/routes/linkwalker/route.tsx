import { ArrowsUpDownIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading, VStack } from '@navikt/ds-react';
import { type LoaderFunctionArgs, useLoaderData } from 'react-router';

import LinkWalkerIntegrationApi from '~/api/LinkWalkerIntegrationApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import type { LatestReportSummary } from '~/types';

import { DetailsTable } from './DetailsTable';
import { OverallSummaryCard } from './OverallSummaryCard';

type LoaderData = {
    summary: LatestReportSummary;
    orgName: string;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // TODO: TESTING ONLY
    // const orgName = await getSelectedOrganization(request);
    const orgName = 'afk_no';

    const summaryResponse = await LinkWalkerIntegrationApi.getSummary(orgName);
    const summary = summaryResponse.data;

    return Response.json({ summary, orgName });
};

export default function LinkWalkerRoute() {
    const { summary } = useLoaderData<LoaderData>();
    const breadcrumbs = [{ name: 'Link-Walker', link: '/linkwalker' }];
    const sortedComponents = [...summary.summary.components].sort((a, b) => {
        const integrityA = a.integrityPercent ?? Number.POSITIVE_INFINITY;
        const integrityB = b.integrityPercent ?? Number.POSITIVE_INFINITY;

        if (integrityA === integrityB) {
            return a.component.localeCompare(b.component);
        }

        return integrityA - integrityB;
    });

    function getBrokenLinkHref(component?: string, resource?: string) {
        const params = new URLSearchParams();

        if (component) {
            params.set('component', component);
        }

        if (resource) {
            params.set('resource', resource);
        }

        const query = params.toString();

        return `/linkwalker/broken${query ? `?${query}` : ''}`;
    }

    if (!summary) {
        return (
            <>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <InternalPageHeader title="Link-Walker" icon={ArrowsUpDownIcon} />
                <Box padding="space-16">
                    <BodyShort>Ingen data tilgjengelig</BodyShort>
                </Box>
            </>
        );
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title="Link-Walker" icon={ArrowsUpDownIcon}>
                <Button variant="secondary" size="small" as="a" href="/linkwalker/broken?page=0">
                    Vis rapport over brutte lenker
                </Button>
            </InternalPageHeader>

            <VStack gap="space-16" className={'p-8'}>
                <OverallSummaryCard
                    scanCompletedAt={summary.scanCompletedAt}
                    summary={summary.summary}
                />
                <VStack gap="space-4">
                    <Heading size="medium">Komponentsammendrag</Heading>
                    <DetailsTable
                        items={sortedComponents}
                        getErrorHref={(component) => getBrokenLinkHref(component.component)}
                        getResourceErrorHref={(component, resource) =>
                            getBrokenLinkHref(component.component, resource.resource)
                        }
                        emptyText="Ingen komponenter registrert."
                    />
                </VStack>
            </VStack>
        </>
    );
}
