import { BodyShort, Button, CopyButton, HStack, Label } from '@navikt/ds-react';
import { ThumbUpIcon, ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Form } from '@remix-run/react';

export function ValueDisplayPanel({
    label,
    value,
    name,
    revalidate,
}: {
    label: string;
    value: string;
    name?: string;
    revalidate?: () => void;
}) {
    return (
        <HStack className="flex !justify-between !items-center">
            <HStack gap="4">
                <Label>{label}</Label>
                <BodyShort>{value}</BodyShort>
            </HStack>
            <HStack className=" flex !items-center">
                {name && (
                    <Form method="post" action={`/adapter/${name}?name=${name}`}>
                        <Button
                            type="submit"
                            variant="tertiary-neutral"
                            icon={<ArrowCirclepathIcon title="Refresh" fontSize="1.5rem" />}>
                            Hent {label}
                        </Button>
                    </Form>
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
