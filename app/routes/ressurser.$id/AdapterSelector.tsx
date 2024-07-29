import React from 'react';
import { Box, Heading, HGrid } from '@navikt/ds-react';
import { AdapterList } from '~/components/shared/AdapterList';
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
                        Adaptere tilknyttet denne ressurs
                    </Heading>
                    <CustomTabs
                        items={items}
                        selectable
                        selectedItems={selectedItems}
                        toggleSwitch={(name, isChecked) => {
                            if (isChecked) {
                                // add adapter to asset
                                submit(
                                    {
                                        adapterName: name,
                                        actionType: 'ADD_ADAPTER_TO_ASSET',
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

export default AdapterSelector;
