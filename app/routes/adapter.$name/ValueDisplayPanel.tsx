import { BodyShort, Button, CopyButton, HStack, Label } from '@navikt/ds-react';
import { ThumbUpIcon, ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { useFetcher } from '@remix-run/react';

export function ValueDisplayPanel({
    label,
    value,
    fetcherKey,
}: {
    label: string;
    value: string;
    fetcherKey?: string;
}) {
    const fetcher = useFetcher({ key: fetcherKey });

    return (
        <HStack className="flex !justify-between !items-center">
            <HStack gap="4">
                <Label>{label}</Label>
                <BodyShort>{value}</BodyShort>
            </HStack>
            <HStack className=" flex !items-center">
                {fetcherKey && (
                    <fetcher.Form method="post">
                        <input type="hidden" name="type" value={label} />
                        <Button
                            type="submit"
                            variant="tertiary-neutral"
                            icon={<ArrowCirclepathIcon title="Refresh" fontSize="1.5rem" />}>
                            Hent {label}
                        </Button>
                    </fetcher.Form>
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
