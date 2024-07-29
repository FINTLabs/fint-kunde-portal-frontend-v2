import React from 'react';
import { Box, Heading, HGrid } from '@navikt/ds-react';
import { useSubmit } from '@remix-run/react';
import { IClient } from '~/types/Clients';
import ClientTable from '../klienter._index/ClientTable';

interface ClientSelectorProps {
    items: IClient[];
    selectedItems: string[];
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ items, selectedItems }) => {
    const submit = useSubmit();

    return (
        <>
            <Box padding="4">
                <HGrid gap="8">
                    <Heading size="medium" spacing>
                        Klienter tilknyttet ressurs
                    </Heading>
                    <ClientTable
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
                    />
                </HGrid>
            </Box>
        </>
    );
};

export default ClientSelector;
