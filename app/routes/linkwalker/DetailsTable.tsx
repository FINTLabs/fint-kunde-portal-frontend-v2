import { LinkBrokenIcon, CircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, ProgressBar, Table, VStack } from '@navikt/ds-react';
import { Link as RouterLink } from 'react-router';

import type { ComponentSummary, LinkWalkerBrokenNavigationState, ResourceSummary } from '~/types';

interface DetailsTableProps {
    items: ComponentSummary[];
    getErrorHref?: (item: ComponentSummary) => string;
    getResourceErrorHref?: (component: ComponentSummary, resource: ResourceSummary) => string;
    emptyText: string;
}

function formatTitle(title: string) {
    return title.split('_').join(' ');
}

function formatIntegrity(integrityPercent: number | null) {
    return `${integrityPercent?.toFixed(2) ?? 'N/A'}%`;
}

function getIntegrityStatus(integrityPercent: number | null) {
    if (integrityPercent === null) {
        return { color: 'info' as const, className: 'linkwalker-icon-info', label: 'N/A' };
    }

    if (integrityPercent >= 99) {
        return { color: 'success' as const, className: 'linkwalker-icon-success', label: 'God' };
    }

    if (integrityPercent >= 95) {
        return {
            color: 'warning' as const,
            className: 'linkwalker-icon-warning',
            label: 'Middels',
        };
    }

    return { color: 'danger' as const, className: 'linkwalker-icon-danger', label: 'Lav' };
}

export function DetailsTable({
    items,
    getErrorHref,
    getResourceErrorHref,
    emptyText,
}: DetailsTableProps) {
    if (items.length === 0) {
        return (
            <BodyShort size="small" textColor="subtle">
                {emptyText}
            </BodyShort>
        );
    }

    const getBrokenPageState = (item: ComponentSummary, resource?: ResourceSummary) => {
        const state: LinkWalkerBrokenNavigationState = {
            problemTypeSummary: {
                source: resource ? 'resource' : 'component',
                component: item.component,
                resource: resource?.resource,
                byProblemType: resource?.byProblemType ?? item.byProblemType,
            },
        };

        return state;
    };

    const renderExpandableContent = (item: ComponentSummary) => (
        <Box padding="space-32">
            {item.resources.length > 0 ? (
                <Table size="small" zebraStripes={true}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Ressurs</Table.HeaderCell>
                            <Table.HeaderCell>Records</Table.HeaderCell>
                            <Table.HeaderCell>Referanser</Table.HeaderCell>
                            <Table.HeaderCell>Brutte lenker</Table.HeaderCell>
                            <Table.HeaderCell>Integritet</Table.HeaderCell>
                            <Table.HeaderCell />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {[...item.resources]
                            .sort((a, b) => {
                                const integrityA = a.integrityPercent ?? Number.POSITIVE_INFINITY;
                                const integrityB = b.integrityPercent ?? Number.POSITIVE_INFINITY;

                                if (integrityA === integrityB) {
                                    return a.resource.localeCompare(b.resource);
                                }

                                return integrityA - integrityB;
                            })
                            .map((resource) => {
                                const resourceErrorHref = getResourceErrorHref?.(item, resource);
                                const resourceIntegrityStatus = getIntegrityStatus(
                                    resource.integrityPercent
                                );

                                return (
                                    <Table.Row key={`${item.component}-${resource.resource}`}>
                                        <Table.DataCell>
                                            {formatTitle(resource.resource)}
                                        </Table.DataCell>
                                        <Table.DataCell align="right">
                                            {resource.totalRecords.toLocaleString()}
                                        </Table.DataCell>
                                        <Table.DataCell align="right">
                                            {resource.totalRefs.toLocaleString()}
                                        </Table.DataCell>
                                        <Table.DataCell align="right">
                                            {resource.brokenLinkCount.toLocaleString()}
                                        </Table.DataCell>
                                        <Table.DataCell align="right">
                                            <HStack justify="end" align="center" gap="space-2">
                                                <BodyShort size="small">
                                                    {formatIntegrity(resource.integrityPercent)}
                                                </BodyShort>
                                                <CircleFillIcon
                                                    aria-label={`Integritetstatus ${resourceIntegrityStatus.label}`}
                                                    className={resourceIntegrityStatus.className}
                                                    fontSize="1.1rem"
                                                />
                                            </HStack>
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <HStack justify="end">
                                                {resourceErrorHref &&
                                                    resource.brokenLinkCount > 0 && (
                                                        <Button
                                                            as={RouterLink}
                                                            size="xsmall"
                                                            variant="tertiary"
                                                            to={resourceErrorHref}
                                                            state={getBrokenPageState(
                                                                item,
                                                                resource
                                                            )}
                                                            icon={
                                                                <LinkBrokenIcon
                                                                    title="a11y-title"
                                                                    fontSize="1.2rem"
                                                                />
                                                            }>
                                                            Vis
                                                        </Button>
                                                    )}
                                            </HStack>
                                        </Table.DataCell>
                                    </Table.Row>
                                );
                            })}
                    </Table.Body>
                </Table>
            ) : (
                <BodyShort size="small" textColor="subtle">
                    Ingen ressurser registrert.
                </BodyShort>
            )}
        </Box>
    );

    return (
        <Box borderColor="neutral-subtle" borderWidth="2" borderRadius="12" overflowX="auto">
            <Table size="small" zebraStripes={true}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell>Komponent</Table.HeaderCell>
                        <Table.HeaderCell>Records</Table.HeaderCell>
                        <Table.HeaderCell>Referanser</Table.HeaderCell>
                        <Table.HeaderCell>Brutte lenker</Table.HeaderCell>
                        <Table.HeaderCell>Integritet</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {items.map((item) => {
                        const errorHref = getErrorHref?.(item);
                        const componentIntegrityStatus = getIntegrityStatus(item.integrityPercent);

                        return (
                            <Table.ExpandableRow
                                key={item.component}
                                content={renderExpandableContent(item)}>
                                <Table.DataCell>{formatTitle(item.component)}</Table.DataCell>
                                <Table.DataCell align="right">
                                    {item.totalRecords.toLocaleString()}
                                </Table.DataCell>
                                <Table.DataCell align="right">
                                    {item.totalRefs.toLocaleString()}
                                </Table.DataCell>
                                <Table.DataCell align="right">
                                    {item.brokenLinkCount.toLocaleString()}
                                </Table.DataCell>
                                <Table.DataCell align="right">
                                    <VStack gap="space-2" minWidth="10rem">
                                        <BodyShort size="small">
                                            {formatIntegrity(item.integrityPercent)}
                                        </BodyShort>
                                        <ProgressBar
                                            aria-label={`Integritet for ${formatTitle(item.component)}`}
                                            value={item.integrityPercent ?? 0}
                                            valueMax={100}
                                            size="small"
                                            data-color={componentIntegrityStatus.color}
                                        />
                                    </VStack>
                                </Table.DataCell>
                                <Table.DataCell>
                                    <HStack justify="end">
                                        {errorHref && item.brokenLinkCount > 0 && (
                                            <Button
                                                as={RouterLink}
                                                size="xsmall"
                                                variant="tertiary"
                                                to={errorHref}
                                                state={getBrokenPageState(item)}
                                                icon={
                                                    <LinkBrokenIcon
                                                        title="a11y-title"
                                                        fontSize="1.2rem"
                                                    />
                                                }>
                                                Brutte lenker
                                            </Button>
                                        )}
                                    </HStack>
                                </Table.DataCell>
                            </Table.ExpandableRow>
                        );
                    })}
                </Table.Body>
            </Table>
        </Box>
    );
}
