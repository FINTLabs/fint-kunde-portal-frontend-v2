import { VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { ListItem } from './ListItem';

export function AdapterList({ items }: { items: IAdapter[] }) {
    return (
        <VStack gap="5">
            {items.map((adapter, index) => (
                <ListItem key={index} adapter={adapter} />
            ))}
        </VStack>
    );
}
