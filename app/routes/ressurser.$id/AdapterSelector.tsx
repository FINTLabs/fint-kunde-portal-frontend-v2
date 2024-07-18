import React from 'react';
import { Box, Heading, HGrid } from '@navikt/ds-react';
import { AdapterList } from '~/components/shared/AdapterList';
import { IAdapter } from '~/types/types';
import { useSubmit } from '@remix-run/react';

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
                    <AdapterList
                        items={items}
                        selectable
                        selectedItems={selectedItems}
                        toggleSwitch={(name, isChecked) => {
                            console.log('toggle switch');
                            console.log('name ', name);
                            console.log('is Checked', isChecked);
                            // add adapter to asset

                            if (isChecked) {
                                // add adapter to asset
                                submit(
                                    { name: name },
                                    { method: 'POST', fetcherKey: 'addAdapter' }
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
