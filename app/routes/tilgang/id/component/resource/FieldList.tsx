import { Checkbox, Heading, HStack } from '@navikt/ds-react';

import { IField } from '~/types/Access';

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
            <Heading size="medium">Feltnavn</Heading>

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
