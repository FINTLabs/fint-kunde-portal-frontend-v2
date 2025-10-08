import { Button, Checkbox, FormSummary, HStack } from '@navikt/ds-react';
import React from 'react';

import { IAccessComponent } from '~/types/Access';
import { ChevronRightCircleIcon } from '@navikt/aksel-icons';

interface ConfigClassTableProps {
    accessComponent: IAccessComponent[];
    title: string;
    onSelected: (fieldName: string) => void;
    onToggle: (formData: FormData) => void;
}

const ResourcesList = ({ accessComponent, title, onToggle, onSelected }: ConfigClassTableProps) => {
    function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        const isChecked = e.target.checked;

        const formData = new FormData();

        formData.append('resource', value);
        formData.append('enabled', isChecked.toString());
        onToggle(formData);
    }


    return (
        <>
            <FormSummary>
                <FormSummary.Header>
                    <FormSummary.Heading level="2">{title}</FormSummary.Heading>
                </FormSummary.Header>
                <FormSummary.Answers>
                    <FormSummary.Answer>
                        {accessComponent.map((x, i) => {
                            return (
                                <HStack key={x.name} justify={'space-between'} align={'center'}>
                                    {/*<HStack align={'center'} gap={'0'}>*/}
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

                                    {/*<ChevronRightCircleIcon*/}
                                    {/*    title="Vis detaljer"*/}
                                    {/*    onClick={() => onSelected(x.name)}*/}
                                    {/*/>*/}
                                {/*    </Box>*/}
                                {/*    </HStack>*/}
                                </HStack>
                            );
                        })}
                    </FormSummary.Answer>
                </FormSummary.Answers>
            </FormSummary>
        </>
    );
};

// checked={x.name == 'elevforhold' || x.name == 'elev' ? true : false}
// disabled={x.name == 'elev' ? true : false}
export default ResourcesList;
