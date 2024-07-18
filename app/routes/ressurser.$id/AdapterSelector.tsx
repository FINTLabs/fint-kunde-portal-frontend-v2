import React from 'react';
import { Box, Chips, Detail, Heading, HGrid, Label, Switch, Table, Tag } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';
import { AdapterList } from '~/components/shared/AdapterList';
import { IAdapter } from '~/types/types';

interface AdapterSelectorProps {
    items: IAdapter[];
    selectedItems: string[]; // TODO fix this: It comes as a string like this "cn=frode@adapter.fintlabs.no,ou=adapters,ou=fintlabs_no,ou=organisations,o=fint"
}

const AdapterSelector: React.FC<AdapterSelectorProps> = ({ items, selectedItems }) => {
    const navigate = useNavigate();

    // const sortedComponents = components.sort((a, b) => a.name.localeCompare(b.name));

    // const handleRowClick = (component: IComponent) => {
    //     navigate(`/komponenter/${component.name}`);
    // };

    // // Function to split components into chunks
    // const chunkArray = (array: IComponent[], chunkSize: number) => {
    //     const chunks = [];
    //     for (let i = 0; i < array.length; i += chunkSize) {
    //         chunks.push(array.slice(i, i + chunkSize));
    //     }
    //     return chunks;
    // };

    // const componentChunks = chunkArray(
    //     sortedComponents,
    //     Math.ceil(sortedComponents.length / columns)
    // );

    return (
        <>
            <Box padding="4">
                <HGrid gap="8">
                    <Heading size="medium" spacing>
                        Adaptere tilknyttet denne ressurs
                    </Heading>

                    <AdapterList items={items} selectable selectedItems={selectedItems} />
                </HGrid>
            </Box>
        </>
    );
};

export default AdapterSelector;
