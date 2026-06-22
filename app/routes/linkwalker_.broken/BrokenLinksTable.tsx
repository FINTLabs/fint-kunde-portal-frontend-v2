import { BodyShort, Box, CopyButton, HStack, Link, Table, Tag, VStack } from '@navikt/ds-react';

import type { PagedRows, ProblemType } from '~/types';

interface ErrorsTableProps {
    pagedRows: PagedRows;
}

function getProblemTypeColor(problemType: ProblemType) {
    switch (problemType) {
        case 'missing-resource':
            return 'danger' as const;
        case 'unknown-link':
            return 'warning' as const;
        case 'missing-back-link-adapter':
            return 'info' as const;
        case 'missing-back-link-autorelation':
            return 'meta-purple' as const;
    }
}

export default function BrokenLinksTable({ pagedRows }: ErrorsTableProps) {
    const renderLinkRow = (label: string, href?: string) => (
        <HStack align="center" gap="space-8" wrap={false}>
            <BodyShort size="small">{label}:</BodyShort>
            {href ? (
                <>
                    <Link href={href} target="_blank" rel="noopener noreferrer">
                        {href}
                    </Link>
                    <CopyButton copyText={href} size="small" />
                </>
            ) : (
                <BodyShort size="small" textColor="subtle">
                    N/A
                </BodyShort>
            )}
        </HStack>
    );

    return (
        <Box padding="space-16" borderColor="neutral-subtle" borderWidth="2" borderRadius="12">
            {pagedRows.rows.length === 0 ? (
                <BodyShort size="small" textColor="subtle">
                    Ingen feil funnet.
                </BodyShort>
            ) : (
                <Table size="small" zebraStripes={true}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell>Komponent</Table.HeaderCell>
                            <Table.HeaderCell>Ressurs</Table.HeaderCell>
                            <Table.HeaderCell>Problemtype</Table.HeaderCell>
                            <Table.HeaderCell>Relasjon</Table.HeaderCell>
                            <Table.HeaderCell>Forventet tilbake</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {pagedRows.rows.map((row, index) => (
                            <Table.ExpandableRow
                                key={`${row.sourceSelf}-${row.targetHref}-${index}`}
                                content={
                                    <VStack gap="space-8">
                                        {renderLinkRow('Kilde', row.sourceSelf)}
                                        {renderLinkRow('Mål', row.targetHref)}
                                    </VStack>
                                }>
                                <Table.DataCell>{row.component}</Table.DataCell>
                                <Table.DataCell>{row.resource}</Table.DataCell>
                                <Table.DataCell>
                                    <Tag
                                        size="small"
                                        variant="outline"
                                        data-color={getProblemTypeColor(row.problemType)}>
                                        {row.problemType}
                                    </Tag>
                                </Table.DataCell>
                                <Table.DataCell>{row.relationName ?? '-'}</Table.DataCell>
                                <Table.DataCell>{row.expectedInverseName ?? '-'}</Table.DataCell>
                            </Table.ExpandableRow>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </Box>
    );
}
