import React from 'react';
import { Box, Heading, HGrid } from '@navikt/ds-react';
import { AdapterList } from '~/components/shared/AdapterList';
import { IAdapter } from '~/types/types';

interface AdapterSelectorProps {
    items: IAdapter[];
    selectedItems: string[];
}

const AdapterSelector: React.FC<AdapterSelectorProps> = ({ items, selectedItems }) => {
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
                        toggleSwitch={() => {
                            console.log('toggle switch');
                        }}
                    />
                </HGrid>
            </Box>
        </>
    );
};

export default AdapterSelector;
