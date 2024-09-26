import { Button, FormSummary, HStack, Table, TextField, VStack } from '@navikt/ds-react';
import {
    ArrowRightIcon,
    EyeIcon,
    EyeSlashIcon,
    FloppydiskIcon,
    PadlockLockedIcon,
    PadlockUnlockedIcon,
    PencilWritingIcon,
    XMarkIcon,
} from '@navikt/aksel-icons';
import React, { useState } from 'react';
import ResourceSelect from '~/routes/accesscontrol.$id/ResourceSelect';
import IconToggleButtons from '~/routes/accesscontrol.$id/IconToggleButtons';
import { mockData } from './MockData';

interface DataItem {
    name: string;
    id: string;
    isVisible: boolean;
    hasValue?: string;
}

interface FieldListProps {
    onSave: (formData: { resourceId: string }) => void;
}

const FieldList: React.FC<FieldListProps> = ({ onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState<DataItem[]>(mockData);

    const handleEditClick = () => {
        console.info('-----EDIT', isEditing);
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        console.info('-----cancel', isEditing);
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        console.info('-----save', isEditing);
        const formData = {
            resourceId: 'newServiceName',
            actionType: 'SAVE_FIELDS',
        };
        onSave(formData);
        setIsEditing(false);
    };

    const handleInputChange = (index: number, key: keyof DataItem, value: string | boolean) => {
        setData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index] = { ...updatedData[index], [key]: value };
            return updatedData;
        });
    };

    const toggleVisibility = (index: number) => {
        handleInputChange(index, 'isVisible', !data[index].isVisible);
    };

    function handleTogglePosting() {
        const formData = {
            resourceId: 'newServiceName',
            actionType: 'TOGGLE_NUMBER_POSTINGS',
        };
        onSave(formData);
    }

    function handleToggleAccess() {
        const formData = {
            resourceId: 'newServiceName',
            actionType: 'TOGGLE_ACCESS',
        };
        onSave(formData);
    }

    return (
        <FormSummary key={`x`}>
            <FormSummary.Header>
                <FormSummary.Heading level="2">
                    <HStack gap={'3'}>
                        Tilpasse tilgang: Utdanning Elev
                        <ArrowRightIcon title="a11y-title" fontSize="1.5rem" /> Elev
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
                            {data.map(({ name, id, isVisible, hasValue }, i) => {
                                return (
                                    <Table.Row key={id}>
                                        <Table.HeaderCell scope="row">{name}</Table.HeaderCell>
                                        <Table.DataCell>
                                            {!isEditing ? (
                                                isVisible ? (
                                                    <EyeIcon title="Hide" fontSize="1.5rem" />
                                                ) : (
                                                    <EyeSlashIcon title="Show" fontSize="1.5rem" />
                                                )
                                            ) : (
                                                <Button
                                                    onClick={() => toggleVisibility(i)}
                                                    variant={'tertiary'}
                                                    size={'xsmall'}
                                                    icon={
                                                        isVisible ? (
                                                            <EyeIcon
                                                                title="Hide"
                                                                fontSize="1.5rem"
                                                            />
                                                        ) : (
                                                            <EyeSlashIcon
                                                                title="Show"
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
                                                value={hasValue}
                                                onChange={(e) =>
                                                    handleInputChange(i, 'hasValue', e.target.value)
                                                }
                                            />
                                        </Table.DataCell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>
                </FormSummary.Answer>
                <FormSummary.Answer>
                    <FormSummary.Label>Flere handlinger</FormSummary.Label>
                    <FormSummary.Value>
                        {isEditing ? (
                            <HStack gap={'5'}>
                                <Button
                                    icon={<PadlockUnlockedIcon aria-hidden />}
                                    variant={'tertiary'}
                                    size={'small'}>
                                    GI FULL TILGANG
                                </Button>
                                <Button
                                    icon={<PadlockLockedIcon aria-hidden />}
                                    variant={'tertiary'}
                                    size={'small'}>
                                    FJERNE ALT TILGANG
                                </Button>
                            </HStack>
                        ) : (
                            <VStack gap={'10'}>
                                <IconToggleButtons
                                    resourceName={'Utdanning Elev'}
                                    onConfirmPosting={handleTogglePosting}
                                    onConfirmAccess={handleToggleAccess}
                                />
                                <ResourceSelect />
                            </VStack>
                        )}
                    </FormSummary.Value>
                </FormSummary.Answer>
            </FormSummary.Answers>
        </FormSummary>
    );
};

export default FieldList;
