import {
    BodyShort,
    Box,
    Heading,
    HGrid,
    HStack,
    InfoCard,
    Label,
    ProgressBar,
    VStack,
} from '@navikt/ds-react';

import type { ScanSummary } from '~/types';
import { ProblemTypeEntries } from '~/routes/linkwalker/ProblemTypeEntries';

interface OverallSummaryCardProps {
    scanCompletedAt: string;
    summary: ScanSummary;
}

export function OverallSummaryCard({ scanCompletedAt, summary }: OverallSummaryCardProps) {
    const scanDate = new Date(scanCompletedAt).toLocaleString('no-NO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    return (
        <Box padding="space-16" borderColor="neutral-subtle" borderWidth="2" borderRadius="12">
            <VStack gap="space-6">
                <HStack justify="space-between" align="center">
                    <Heading size="medium">Oversikt</Heading>
                    <BodyShort size="small" textColor="subtle">
                        Skannet: {scanDate}
                    </BodyShort>
                </HStack>

                <HGrid columns={4} gap="space-16">
                    <InfoCard data-color="info">
                        <InfoCard.Header>
                            <InfoCard.Title>Total Records</InfoCard.Title>
                        </InfoCard.Header>
                        <InfoCard.Content className="text-center">
                            <Heading size="large">{summary.totalRecords.toLocaleString()}</Heading>
                        </InfoCard.Content>
                    </InfoCard>
                    <InfoCard data-color="info">
                        <InfoCard.Header>
                            <InfoCard.Title>Total Referanser</InfoCard.Title>
                        </InfoCard.Header>
                        <InfoCard.Content>
                            <Heading size="large" className="text-center">
                                {summary.totalRefs.toLocaleString()}
                            </Heading>
                        </InfoCard.Content>
                    </InfoCard>
                    <InfoCard data-color="danger">
                        <InfoCard.Header>
                            <InfoCard.Title>Brutte Lenker</InfoCard.Title>
                        </InfoCard.Header>
                        <InfoCard.Content>
                            <Heading size="large" className=" text-center linkwalker-text-danger">
                                {summary.brokenLinkCount.toLocaleString()}
                            </Heading>
                        </InfoCard.Content>
                    </InfoCard>
                    <InfoCard data-color="success">
                        <InfoCard.Header>
                            <InfoCard.Title>Integritet</InfoCard.Title>
                        </InfoCard.Header>
                        <InfoCard.Content>
                            <Heading size="large" className="linkwalker-text-success text-center">
                                {summary.integrityPercent?.toFixed(2)}%
                            </Heading>
                        </InfoCard.Content>
                    </InfoCard>
                </HGrid>

                <VStack gap="space-2">
                    <Label size="small">Link Integritet</Label>
                    <ProgressBar
                        aria-label="Link Integrity Progress"
                        value={summary.integrityPercent ?? 0}
                        valueMax={100}
                        size="medium"
                    />
                </VStack>
                <ProblemTypeEntries byProblemType={summary.byProblemType} />
            </VStack>
        </Box>
    );
}
