import { Button, FormSummary, HStack, Table, TextField } from '@navikt/ds-react';
import {
    EyeIcon,
    EyeSlashIcon,
    FloppydiskIcon,
    PencilWritingIcon,
    XMarkIcon,
} from '@navikt/aksel-icons';
import React, { useState } from 'react';
import { IField } from '~/types/Access';

interface FieldListProps {
    onSave: (updatedFields: IField[]) => void;
    title: string;
    fieldList: IField[];
}

const FieldList = ({ onSave, title, fieldList }: FieldListProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [data, setData] = useState(fieldList);
    const CSV_REGEX = /^[A-Za-z0-9_-]+(?:,[A-Za-z0-9_-]+)*$/;

    const [errorMessages, setErrorMessages] = useState<string[]>(fieldList.map(() => ''));

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setErrorMessages(fieldList.map(() => ''));
        setData(fieldList);
        setHasUnsavedChanges(false);
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        const hasError = errorMessages.some((msg) => msg.length > 0);
        if (hasError) {
            return;
        }
        onSave(data);
        setIsEditing(false);
        setHasUnsavedChanges(false);
    };

    // const handleInputChange = (index: number, key: keyof IField, value: string | boolean) => {
    //     setData((prevData) => {
    //         const updatedData = [...prevData];
    //         updatedData[index] = { ...updatedData[index], [key]: value };
    //         return updatedData;
    //     });
    //     setHasUnsavedChanges(true);
    // };
    const handleInputChange = (index: number, key: keyof IField, value: string | boolean) => {
        setData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index] = { ...updatedData[index], [key]: value };
            return updatedData;
        });

        // If the changed field is “mustContain”, re-validate and set error message
        if (key === 'mustContain') {
            const str = value as string;
            if (str.length === 0) {
                // You could allow empty (meaning “no must-contain constraints”), or treat as valid
                setErrorMessages((prev) => {
                    const copy = [...prev];
                    copy[index] = '';
                    return copy;
                });
            } else if (!CSV_REGEX.test(str)) {
                setErrorMessages((prev) => {
                    const copy = [...prev];
                    copy[index] = 'Må være komma-separert liste';
                    return copy;
                });
            } else {
                setErrorMessages((prev) => {
                    const copy = [...prev];
                    copy[index] = '';
                    return copy;
                });
            }
        }

        setHasUnsavedChanges(true);
    };

    const toggleVisibility = (index: number) => {
        handleInputChange(index, 'enabled', !data[index].enabled);
    };

    return (
        <FormSummary key={`x`}>
            <FormSummary.Header>
                <FormSummary.Heading level="2">
                    <HStack gap={'3'}>{title}</HStack>
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
                {hasUnsavedChanges && (
                    <FormSummary.Label className={'text-amber-400'}>
                        Husk å lagre endringene dine!
                    </FormSummary.Label>
                )}

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
                            {data.map(({ name, enabled, mustContain }, i) => (
                                <Table.Row key={name}>
                                    <Table.HeaderCell scope="row">{name}</Table.HeaderCell>
                                    <Table.DataCell>
                                        {!isEditing ? (
                                            enabled ? (
                                                <EyeIcon title="Hidden" fontSize="1.5rem" />
                                            ) : (
                                                <EyeSlashIcon title="Visible" fontSize="1.5rem" />
                                            )
                                        ) : (
                                            <Button
                                                onClick={() => toggleVisibility(i)}
                                                variant={'tertiary'}
                                                size={'xsmall'}
                                                icon={
                                                    enabled ? (
                                                        <EyeIcon title="Hidden" fontSize="1.5rem" />
                                                    ) : (
                                                        <EyeSlashIcon
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
                                            value={mustContain}
                                            onChange={(e) =>
                                                handleInputChange(i, 'mustContain', e.target.value)
                                            }
                                            error={errorMessages[i] ? errorMessages[i] : undefined}
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
