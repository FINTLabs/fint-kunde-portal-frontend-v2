import { BodyShort, Button, CopyButton, HStack, Label } from '@navikt/ds-react';
import { ThumbUpIcon, ArrowCirclepathIcon } from '@navikt/aksel-icons';

export function ValueDisplayPanel({
    label,
    value,
    revalidate,
}: {
    label: string;
    value: string;
    revalidate?: () => void;
}) {
    return (
        <HStack className="flex !justify-between !items-center">
            <HStack gap="4">
                <Label>{label}</Label>
                <BodyShort>{value}</BodyShort>
            </HStack>
            <HStack className=" flex !items-center">
                {revalidate && (
                    <Button
                        variant="tertiary-neutral"
                        icon={<ArrowCirclepathIcon title="Refresh" fontSize="1.5rem" />}
                        onClick={revalidate}>
                        Hent {label}
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
