import React from 'react';
import { Box, Heading, HGrid } from '@navikt/ds-react';
import { useSubmit } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import { IComponent } from '~/types/Component';
import ComponentsTable from '../komponenter._index/ComponentsTable';

interface ComponentSelectorProps {
    items: IComponent[];
    selectedItems: string[];
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ items, selectedItems }) => {
    const submit = useSubmit();

    return (
        <>
            <Box padding="4">
                <HGrid gap="8">
                    <Heading size="medium" spacing>
                        Komponenter tilknyttet ressurs
                    </Heading>
                    <ComponentsTable components={items} selectedComponents={selectedItems} />
                    {/* <ClientTable
                        clients={items}
                        selectable
                        selectedItems={selectedItems}
                        toggleSwitch={(name, isChecked) => {
                            submit(
                                {
                                    clientName: name,
                                    updateType: isChecked ? 'add' : 'remove',
                                    actionType: 'UPDATE_CLIENT_IN_ASSET',
                                },
                                {
                                    method: 'POST',
                                    action: 'update',
                                    navigate: false,
                                }
                            );
                        }}
                    /> */}
                </HGrid>
            </Box>
        </>
    );
};

export default ComponentSelector;
