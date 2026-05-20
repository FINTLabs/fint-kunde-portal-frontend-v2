import { BodyShort, Box, Detail, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';

interface ProblemTypeEntriesProps {
    byProblemType: Record<string, number>;
}

export function ProblemTypeEntries({ byProblemType }: ProblemTypeEntriesProps) {
    const problemTypeEntries = Object.entries(byProblemType).sort(
        ([, countA], [, countB]) => countB - countA
    );
    const totalProblemTypeCount = problemTypeEntries.reduce((total, [, count]) => total + count, 0);
    const desktopColumns = Math.min(Math.max(problemTypeEntries.length, 1), 4);

    return (
        <VStack gap="space-4">
            <HStack justify="space-between" align="end" gap="space-4" wrap>
                <Heading size="small">Problemtyper</Heading>
                <BodyShort size="small" textColor="subtle">
                    {totalProblemTypeCount.toLocaleString()} registrerte problemer
                </BodyShort>
            </HStack>

            {problemTypeEntries.length > 0 ? (
                <HGrid columns={{ xs: 1, sm: 2, md: desktopColumns }} gap="space-24">
                    {problemTypeEntries.map(([type, count]) => {
                        const percentage =
                            totalProblemTypeCount > 0 ? (count / totalProblemTypeCount) * 100 : 0;
                        //const label = type;

                        return (
                            <Box
                                key={type}
                                padding="space-4"
                                background="neutral-soft"
                                borderColor="neutral-subtle"
                                borderWidth="1"
                                borderRadius="8">
                                <VStack gap="space-4">
                                    <HStack justify="space-between" gap="space-4" wrap={false}>
                                        <BodyShort
                                            size="small"
                                            weight="semibold"
                                            className="min-w-0 truncate"
                                            title={type}>
                                            {type}
                                        </BodyShort>
                                        <Detail weight="semibold" className="shrink-0">
                                            {percentage.toFixed(0)}%
                                        </Detail>
                                    </HStack>
                                    <HStack align="end" gap="space-2" justify="center">
                                        <Heading size="medium">{count.toLocaleString()}</Heading>
                                    </HStack>
                                </VStack>
                            </Box>
                        );
                    })}
                </HGrid>
            ) : (
                <Box
                    padding="space-4"
                    background="neutral-soft"
                    borderColor="neutral-subtle"
                    borderWidth="1"
                    borderRadius="8">
                    <BodyShort size="small" textColor="subtle">
                        Ingen problemtyper registrert.
                    </BodyShort>
                </Box>
            )}
        </VStack>
    );
}
