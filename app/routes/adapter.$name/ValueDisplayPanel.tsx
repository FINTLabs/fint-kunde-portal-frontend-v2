import {
    BodyShort,
    Button,
    CopyButton as NavCopyButton,
    HStack,
    Label,
    VStack,
} from '@navikt/ds-react';
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

    const Fetcher = () => {
        return (
            fetcherKey && (
                <fetcher.Form method="post">
                    <input type="hidden" name="type" value={label} />
                    <Button
                        type="submit"
                        variant="tertiary-neutral"
                        icon={<ArrowCirclepathIcon title="Refresh" fontSize="1.5rem" />}>
                        Hent {label}
                    </Button>
                </fetcher.Form>
            )
        );
    };

    const CopyButton = () => {
        return (
            !!value && (
                <NavCopyButton
                    copyText={value}
                    activeText={`${label} er kopiert!`}
                    activeIcon={<ThumbUpIcon aria-hidden />}
                />
            )
        );
    };

    return label === 'Klient Hemmelighet' || label === 'Passord' ? (
        <VStack className="mt-2">
            <HStack align={'center'} justify={'space-between'}>
                <Label>{label}</Label>
                <HStack>
                    <Fetcher />
                </HStack>
            </HStack>
            <HStack align="center" justify={'space-between'}>
                <BodyShort>{value}</BodyShort>
                <CopyButton />
            </HStack>
        </VStack>
    ) : (
        <HStack className="flex !justify-between !items-center mt-2">
            <HStack gap="4">
                <Label>{label}</Label>
                <BodyShort>{value}</BodyShort>
            </HStack>
            <HStack className="flex !items-center">
                <Fetcher />
                <CopyButton />
            </HStack>
        </HStack>
    );
}
