import { Button, Checkbox, FormSummary, HStack } from '@navikt/ds-react';
import React from 'react';

import { IAccessComponent } from '~/types/Access';
import { ChevronRightCircleIcon } from '@navikt/aksel-icons';

interface ConfigClassTableProps {
    accessComponent: IAccessComponent[];
    title: string;
    onSelected: (fieldName: string) => void;
    onToggle: (formData: FormData) => void;
    onBulkToggle?: (formData: FormData) => void;
    isSubmitting?: boolean;
}

const ResourcesList = ({ accessComponent, title, onToggle, onSelected, onBulkToggle, isSubmitting }: ConfigClassTableProps) => {
    function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        const isChecked = e.target.checked;

        const formData = new FormData();

        formData.append('resource', value);
        formData.append('enabled', isChecked.toString());
        onToggle(formData);
    }

    function handleSelectAll() {
        if (onBulkToggle) {
            const resourcesToEnable = accessComponent
                .filter((resource) => !resource.enabled)
                .map((resource) => ({
                    component: resource.name,
                    resource: resource.name,
                    enabled: true,
                    writeable: resource.writeable,
                    readingOption: resource.readingOption
                }));

            const formData = new FormData();
            formData.append('resources', JSON.stringify(resourcesToEnable));
            onBulkToggle(formData);
        }
    }

    function handleDeselectAll() {
        if (onBulkToggle) {
            const resourcesToDisable = accessComponent
                .filter((resource) => resource.enabled)
                .map((resource) => ({
                    component: resource.name,
                    resource: resource.name,
                    enabled: false,
                    writeable: resource.writeable,
                    readingOption: resource.readingOption
                }));

            const formData = new FormData();
            formData.append('resources', JSON.stringify(resourcesToDisable));
            formData.append('disable', 'true');
            onBulkToggle(formData);
        }
    }

    return (
        <>
            <FormSummary>
                <FormSummary.Header>
                    <FormSummary.Heading level="2">{title}</FormSummary.Heading>
                    <HStack gap="2" style={{ marginTop: '1rem' }}>
                        <Button
                            onClick={handleSelectAll}
                            variant="secondary"
                            size="small"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            data-cy="select-all-resources">
                            Velg alle
                        </Button>
                        <Button
                            onClick={handleDeselectAll}
                            variant="secondary"
                            size="small"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            data-cy="deselect-all-resources">
                            Fjern alle
                        </Button>
                    </HStack>
                </FormSummary.Header>
                <FormSummary.Answers>
                    <FormSummary.Answer>
                        {accessComponent.map((x, i) => {
                            return (
                                <HStack key={x.name} justify={'space-between'} align={'center'}>
                                    <Checkbox
                                        onChange={(e) => handleCheckbox(e)}
                                        value={x.name}
                                        key={x.name + i}
                                        checked={x.enabled}
                                        data-cy={`resource-toggle-${x.name}`}>
                                        {x.name}
                                    </Checkbox>

                                    <Button
                                        icon={<ChevronRightCircleIcon title="Rediger" />}
                                        onClick={() => onSelected(x.name)}
                                        variant={'tertiary'}
                                        size={'xsmall'}
                                        disabled={!x.enabled}
                                        data-cy={`resource-details-${x.name}`}
                                    />

                                </HStack>
                            );
                        })}
                    </FormSummary.Answer>
                </FormSummary.Answers>
            </FormSummary>
        </>
    );
};

export default ResourcesList;
