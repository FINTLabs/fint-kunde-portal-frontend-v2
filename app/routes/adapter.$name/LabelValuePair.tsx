import { BodyShort, Button, CopyButton, HStack, Label } from '@navikt/ds-react';
import { ThumbUpIcon, ArrowCirclepathIcon } from '@navikt/aksel-icons';

export function LabelValuePair({
    label,
    value,
    displayRefreshButton,
    displayFetchValue,
    handleRefresh,
}: {
    label: string;
    value: string;
    displayRefreshButton?: boolean;
    displayFetchValue?: boolean;
    handleRefresh?: () => void;
}) {
    return (
        <HStack className="flex !justify-between !items-center">
            <HStack gap="4">
                <Label>{label}</Label>
                <BodyShort>{value}</BodyShort>
            </HStack>
            <HStack className=" flex !items-center">
                {displayFetchValue && (
                    <Button
                        variant="tertiary-neutral"
                        icon={
                            <ArrowCirclepathIcon
                                title="Hent klient hemmelighet"
                                fontSize="1.5rem"
                            />
                        }
                        onClick={handleRefresh}>
                        Hent hemmelighet
                    </Button>
                )}
                {displayRefreshButton && (
                    <Button
                        variant="tertiary-neutral"
                        icon={<ArrowCirclepathIcon title="Refresh" fontSize="1.5rem" />}
                        onClick={handleRefresh}>
                        Hent passord
                    </Button>
                )}

                {!!value && (
                    <CopyButton
                        copyText={value}
                        activeText={`${label} er kopiert!`}
                        activeIcon={<ThumbUpIcon aria-hidden />}
                    />
                )}
            </HStack>
        </HStack>
    );
}
