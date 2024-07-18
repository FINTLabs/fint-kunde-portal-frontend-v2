import React from 'react';
import { Box, Chips, Detail, Heading, HGrid, Label, Switch, Table, Tag } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';
import { AdapterList } from '~/components/shared/AdapterList';
import { IAdapter } from '~/types/types';

interface AdapterSelectorProps {
    items: IAdapter[];
    selectedItems: IAdapter[];
}

const AdapterSelector: React.FC<AdapterSelectorProps> = ({ items, selectedItems }) => {
    const navigate = useNavigate();

    console.log(items);
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

                    <AdapterList items={items} selectable />
                </HGrid>
            </Box>
        </>
    );
};

export default AdapterSelector;
