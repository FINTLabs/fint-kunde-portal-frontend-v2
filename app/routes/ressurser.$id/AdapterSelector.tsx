import React from 'react';
import { Box, Heading, HGrid } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useSubmit } from '@remix-run/react';
import { CustomTabs } from '~/components/shared/CustomTabs';

interface AdapterSelectorProps {
    items: IAdapter[];
    selectedItems: string[];
}

const AdapterSelector: React.FC<AdapterSelectorProps> = ({ items, selectedItems }) => {
    const submit = useSubmit();

    return (
        <>
            <Box padding="4">
                <HGrid gap="8">
                    <Heading size="medium" spacing>
                        Adaptere tilknyttet ressurs
                    </Heading>
                    <CustomTabs
                        items={items}
                        selectable
                        selectedItems={selectedItems}
                        toggleSwitch={(name, isChecked) => {
                            submit(
                                {
                                    adapterName: name,
                                    updateType: isChecked ? 'add' : 'remove',
                                    actionType: 'UPDATE_ADAPTER_IN_ASSET',
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

export default AdapterSelector;
