import React from 'react';
import { Box, Heading, HGrid } from '@navikt/ds-react';
import { useSubmit } from '@remix-run/react';
import { IComponent } from '~/types/Component';
import ComponentsTable from '../../routes/komponenter._index/ComponentsTable';

interface ComponentSelectorProps {
    items: IComponent[];
    selectedItems: string[];
    toggle: (name: string, isChecked: boolean) => void;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ items, selectedItems, toggle }) => {
    return (
        <>
            <Box padding="6">
                <HGrid gap="2">
                    <Heading size="medium" spacing>
                        Komponenter tilknyttet
                    </Heading>
                    <ComponentsTable items={items} selectedItems={selectedItems} toggle={toggle} />
                </HGrid>
            </Box>
        </>
    );
};

export default ComponentSelector;
