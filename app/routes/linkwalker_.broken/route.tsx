import { LinkBrokenIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, HStack, InfoCard, Pagination, Select, VStack } from '@navikt/ds-react';
import { type LoaderFunctionArgs, useLoaderData, useLocation, useSearchParams } from 'react-router';

import LinkWalkerIntegrationApi from '~/api/LinkWalkerIntegrationApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import type { LinkWalkerBrokenNavigationState, PagedRows, ReportRow } from '~/types';
import BrokenLinksFilterForm from './BrokenLinksFilterForm';
import BrokenLinksTable from './BrokenLinksTable';

type LoaderData = {
    pagedRows: PagedRows;
    filterRows: ReportRow[];
    orgName: string;
};

interface FilterOption {
    value: string;
    label: string;
}

function getProblemTypeColor(problemType: string) {
    switch (problemType) {
        case 'missing-resource':
            return 'danger' as const;
        case 'unknown-link':
            return 'warning' as const;
        case 'missing-back-link-adapter':
            return 'info' as const;
        case 'missing-back-link-autorelation':
            return 'meta-purple' as const;
        default:
            return 'neutral' as const;
    }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // TODO: TESTING ONLY
    // const orgName = await getSelectedOrganization(request);
    const orgName = 'afk_no';

    const url = new URL(request.url);
    let hasEmptySearchParams = false;

    for (const [key, value] of Array.from(url.searchParams.entries())) {
        if (value === '') {
            url.searchParams.delete(key);
            hasEmptySearchParams = true;
        }
    }

    if (hasEmptySearchParams) {
        const search = url.searchParams.toString();
        url.search = search ? `?${search}` : '';

        return Response.redirect(url.toString(), 302);
    }

    const component = url.searchParams.get('component') || '';
    const resource = url.searchParams.get('resource') || '';
    const problemType = url.searchParams.get('problemType') || '';
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    const safePage = Number.isNaN(page) ? 0 : page;
    const safeSize = Number.isNaN(size) ? 10 : size;

    const rowsPromise = LinkWalkerIntegrationApi.getRows({
        orgId: orgName,
        component,
        resource,
        problemType: problemType ? problemType : undefined,
        page: safePage,
        size: safeSize,
    })
        .then((response) => response.data)
        .catch(() => ({
            rows: [],
            page: safePage,
            size: safeSize,
            totalRows: 0,
            totalPages: 0,
        }));

    const filterRowsPromise = LinkWalkerIntegrationApi.getRows({
        orgId: orgName,
        page: 0,
        size: 1000,
    })
        .then((response) => response.data?.rows ?? [])
        .catch(() => []);

    const pagedRows = await rowsPromise;
    const filterRows = await filterRowsPromise;

    return {
        pagedRows,
        filterRows,
        orgName,
    };
};

export default function LinkWalkerErrorsRoute() {
    const { pagedRows, filterRows } = useLoaderData<LoaderData>();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigationState = location.state as LinkWalkerBrokenNavigationState | null;
    const passedProblemTypeSummary = navigationState?.problemTypeSummary;
    const selectedComponent = searchParams.get('component');
    const selectedResource = searchParams.get('resource');
    const selectedProblemType = searchParams.get('problemType');
    const selectedSize = searchParams.get('size') ?? '10';
    const breadcrumbs = [
        { name: 'Link-Walker', link: '/linkwalker' },
        { name: 'Brutte Lenker', link: '/linkwalker/broken' },
    ];

    function getUniqueOptions(
        rows: ReportRow[],
        field: 'component' | 'resource',
        selectedValue: string | null
    ): FilterOption[] {
        const values = new Set(rows.map((row) => row[field]));

        if (selectedValue) {
            values.add(selectedValue);
        }

        return [...values]
            .sort((a, b) => a.localeCompare(b))
            .map((value) => ({ value, label: value }));
    }

    const availableProblemTypes = passedProblemTypeSummary
        ? Object.keys(passedProblemTypeSummary.byProblemType)
        : Array.from(new Set(filterRows.map((row) => row.problemType)));
    const problemTypeOptions = availableProblemTypes.map((problemType) => ({
        value: problemType,
        label: problemType,
    }));

    const handleFilterChange = (name: string, value: string) => {
        const nextParams = new URLSearchParams(searchParams);

        if (value) {
            nextParams.set(name, value);
        } else {
            nextParams.delete(name);
        }

        nextParams.set('page', '0');

        setSearchParams(nextParams, {
            preventScrollReset: true,
        });
    };

    const componentOptions = getUniqueOptions(filterRows, 'component', selectedComponent);
    const resourceOptions = getUniqueOptions(filterRows, 'resource', selectedResource);
    // const summaryTitle = passedProblemTypeSummary
    //     ? `Fordeling for ${
    //           passedProblemTypeSummary.source === 'resource'
    //               ? `${passedProblemTypeSummary.component} / ${passedProblemTypeSummary.resource}`
    //               : passedProblemTypeSummary.component
    //       }`
    //     : null;

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title="Link-Walker - Brutte Lenker" icon={LinkBrokenIcon} />

            <VStack gap="space-8">
                {passedProblemTypeSummary && (
                    <VStack gap="space-4">
                        {/*<Heading size="small">{summaryTitle}</Heading>*/}
                        <HStack gap="space-8" justify={'space-evenly'}>
                            {availableProblemTypes.map((problemType) => (
                                <InfoCard
                                    key={problemType}
                                    data-color={getProblemTypeColor(problemType)}
                                    size="small"
                                    className={'w-72'}>
                                    <InfoCard.Header>
                                        <InfoCard.Title
                                            as="h3"
                                            className="min-w-0 truncate"
                                            title={problemType}>
                                            {problemType}
                                        </InfoCard.Title>
                                    </InfoCard.Header>
                                    <InfoCard.Content className={'text-center'}>
                                        <Heading size="medium">
                                            {(
                                                passedProblemTypeSummary.byProblemType[
                                                    problemType
                                                ] ?? 0
                                            ).toLocaleString()}
                                        </Heading>
                                    </InfoCard.Content>
                                </InfoCard>
                            ))}
                        </HStack>
                    </VStack>
                )}
                <BrokenLinksFilterForm
                    searchParams={searchParams}
                    selectedComponent={selectedComponent}
                    selectedResource={selectedResource}
                    selectedProblemType={selectedProblemType}
                    componentOptions={componentOptions}
                    resourceOptions={resourceOptions}
                    problemTypeOptions={problemTypeOptions}
                    onSelectChange={handleFilterChange}
                />
                <BrokenLinksTable pagedRows={pagedRows} />
                {pagedRows.totalRows > 0 && (
                    <HStack gap="space-4" justify="space-between" align="end">
                        {/*<HStack justify="start" align="end">*/}
                        <Select
                            label="Rader per side"
                            size="small"
                            value={selectedSize}
                            onChange={(event) => {
                                const nextParams = new URLSearchParams(searchParams);
                                nextParams.set('size', event.target.value);
                                nextParams.set('page', '0');

                                setSearchParams(nextParams);
                            }}>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </Select>

                        <Pagination
                            page={Math.max(1, pagedRows.page + 1)}
                            count={Math.max(1, pagedRows.totalPages)}
                            size="small"
                            boundaryCount={1}
                            siblingCount={1}
                            onPageChange={(page) => {
                                const nextParams = new URLSearchParams(searchParams);
                                nextParams.set('page', String(page - 1));

                                setSearchParams(nextParams);
                            }}
                        />

                        <BodyShort size="small" textColor="subtle">
                            Side {pagedRows.page + 1} av {pagedRows.totalPages} (
                            {pagedRows.totalRows.toLocaleString()} totalt)
                        </BodyShort>
                    </HStack>
                )}
            </VStack>
        </>
    );
}
