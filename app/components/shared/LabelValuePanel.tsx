import { VStack, Label, BodyLong } from '@navikt/ds-react';

export function LabelValuePanel({ label, value }: { label: string; value: string }) {
    return (
        <VStack justify={'space-between'} className="">
            <Label>{label}</Label>
            <BodyLong className="min-h-15 pt-4">{value}</BodyLong>
        </VStack>
    );
}
