import { Checkbox, Heading, HStack } from '@navikt/ds-react';
import React from 'react';
import { IField } from '~/types/Access';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';

interface FieldListProps {
    onToggleField: (fieldName: string, enabled: boolean) => void;
    fieldList: IField[];
}

const FieldList = ({ onToggleField, fieldList }: FieldListProps) => {
    function handleCheckbox(fieldName: string, enabled: boolean) {
        onToggleField(fieldName, enabled);
    }

    return (
        <>
            <Heading size="medium">Felt Navn</Heading>

            {fieldList
                .filter((field) => !field.relation)
                .map((field, i) => (
                    <HStack key={field.name} justify={'space-between'} align={'center'}>
                        <Checkbox
                            onChange={(e) => handleCheckbox(field.name, e.target.checked)}
                            value={field.name}
                            key={field.name + i}
                            checked={field.enabled}>
                            {field.name}
                        </Checkbox>
                    </HStack>
                ))}

            <Divider />

            <Heading size="medium">Relasjoner</Heading>
            {fieldList
                .filter((field) => field.relation)
                .map((field, i) => (
                    <HStack key={field.name} justify={'space-between'} align={'center'}>
                        <Checkbox
                            onChange={(e) => handleCheckbox(field.name, e.target.checked)}
                            value={field.name}
                            key={field.name + i}
                            checked={field.enabled}>
                            {field.name}
                        </Checkbox>
                    </HStack>
                ))}
        </>
    );
};

export default FieldList;
