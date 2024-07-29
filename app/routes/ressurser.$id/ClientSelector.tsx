import React from 'react';
import { Box, Heading, HGrid } from '@navikt/ds-react';
import { AdapterList } from '~/components/shared/AdapterList';
import { IAdapter } from '~/types/types';
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
                        Klienter tilknyttet ressursen
                    </Heading>
                    <ClientTable
                        clients={items}
                        selectable
                        selectedItems={selectedItems}
                        toggleSwitch={(name, isChecked) => {
                            if (isChecked) {
                                // add adapter to asset
                                submit(
                                    {
                                        clientName: name,
                                        actionType: 'ADD_CLIENT_TO_ASSET',
                                    },
                                    {
                                        method: 'POST',
                                        action: 'update',
                                        navigate: false,
                                    }
                                );
                            } else {
                                /// remove addapter from asset
                            }
                        }}
                    />
                </HGrid>
            </Box>
        </>
    );
};

export default ClientSelector;
