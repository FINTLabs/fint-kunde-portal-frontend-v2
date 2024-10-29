import { Button, FormSummary, HStack, Table, TextField } from '@navikt/ds-react';
import {
    ArrowRightIcon,
    EyeIcon,
    EyeSlashIcon,
    FloppydiskIcon,
    PencilWritingIcon,
    XMarkIcon,
} from '@navikt/aksel-icons';
import React, { useEffect, useState } from 'react';

interface Field {
    name: string;
    shouldContain: string[];
    isHidden: boolean;
}

interface FieldListProps {
    onSave: (formData: { resourceId: string }) => void;
    selectedResource: string;
    type: string;
    fieldList: Field[]; // Add fieldList as a prop
}

const FieldList: React.FC<FieldListProps> = ({ onSave, selectedResource, type, fieldList }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState<Field[]>(fieldList); // Use fieldList instead of mockData

    useEffect(() => {
        setData(fieldList); // Update data when fieldList changes
    }, [fieldList]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        const formData = {
            resourceId: selectedResource,
            actionType: 'SAVE_FIELDS',
        };
        onSave(formData);
        setIsEditing(false);
    };

    const handleInputChange = (index: number, key: keyof Field, value: string | boolean) => {
        setData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index] = { ...updatedData[index], [key]: value };
            return updatedData;
        });
    };

    const toggleVisibility = (index: number) => {
        handleInputChange(index, 'isHidden', !data[index].isHidden);
    };

    return (
        <FormSummary key={`x`}>
            <FormSummary.Header>
                <FormSummary.Heading level="2">
                    <HStack gap={'3'}>
                        Tilpasse tilgang: {type}
                        <ArrowRightIcon title="ArrowRightIcon" fontSize="1.5rem" />{' '}
                        {selectedResource}
                    </HStack>
                </FormSummary.Heading>
                <FormSummary.EditLink href="#">
                    {isEditing ? (
                        <>
                            <FloppydiskIcon
                                title="Save changes"
                                fontSize="1.5rem"
                                onClick={handleSaveClick}
                            />
                            <XMarkIcon
                                title="Cancel changes"
                                fontSize="1.5rem"
                                onClick={handleCancelClick}
                            />
                        </>
                    ) : (
                        <PencilWritingIcon
                            title="Edit"
                            fontSize="1.5rem"
                            onClick={handleEditClick}
                        />
                    )}
                </FormSummary.EditLink>
            </FormSummary.Header>

            <FormSummary.Answers>
                <FormSummary.Answer>
                    <Table size="small">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell scope="col">Felt Navn</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Synlighet</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Må inhold</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {data.map(({ name, isHidden, shouldContain }, i) => (
                                <Table.Row key={name}>
                                    <Table.HeaderCell scope="row">{name}</Table.HeaderCell>
                                    <Table.DataCell>
                                        {!isEditing ? (
                                            isHidden ? (
                                                <EyeSlashIcon title="Hidden" fontSize="1.5rem" />
                                            ) : (
                                                <EyeIcon title="Visible" fontSize="1.5rem" />
                                            )
                                        ) : (
                                            <Button
                                                onClick={() => toggleVisibility(i)}
                                                variant={'tertiary'}
                                                size={'xsmall'}
                                                icon={
                                                    isHidden ? (
                                                        <EyeSlashIcon
                                                            title="Hidden"
                                                            fontSize="1.5rem"
                                                        />
                                                    ) : (
                                                        <EyeIcon
                                                            title="Visible"
                                                            fontSize="1.5rem"
                                                        />
                                                    )
                                                }
                                            />
                                        )}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <TextField
                                            label="input"
                                            size="small"
                                            hideLabel
                                            readOnly={!isEditing}
                                            value={shouldContain.join(', ')}
                                            // onChange={(e) =>
                                            //     handleInputChange(
                                            //         i,
                                            //         'shouldContain',
                                            //         e.target.value.split(',')
                                            //     )
                                            // }
                                        />
                                    </Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </FormSummary.Answer>
            </FormSummary.Answers>
        </FormSummary>
    );
};

export default FieldList;
