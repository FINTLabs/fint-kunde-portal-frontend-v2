import { BodyShort, Button, CopyButton, HStack, Label } from '@navikt/ds-react';
import { ThumbUpIcon, ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Form, useFetcher } from '@remix-run/react';

export function ValueDisplayPanel({
    label,
    value,
    name,
}: {
    label: string;
    value: string;
    name?: string;
}) {
    const fetcher = useFetcher({ key: 'fetch-client-secret' });

    return (
        <HStack className="flex !justify-between !items-center">
            <HStack gap="4">
                <Label>{label}</Label>
                <BodyShort>{value}</BodyShort>
            </HStack>
            <HStack className=" flex !items-center">
                {name && (
                    <fetcher.Form method="post" action={`/adapter/${name}`}>
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
