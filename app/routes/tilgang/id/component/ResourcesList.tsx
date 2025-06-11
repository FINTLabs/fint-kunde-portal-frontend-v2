import React from 'react';
import { Button, Checkbox, FormSummary, HStack } from '@navikt/ds-react';
import { ChevronRightCircleIcon } from '@navikt/aksel-icons';
import { IAccessComponent } from '~/types/Access';

interface ConfigClassTableProps {
    accessComponent: IAccessComponent[];
    title: string;
    onSelected: (fieldName: string) => void;
    onToggle: (formData: FormData) => void;
}

const ResourcesList = ({ accessComponent, title, onSelected, onToggle }: ConfigClassTableProps) => {
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
                    {/*<HStack align={'center'} justify={'space-between'}>*/}
                    <FormSummary.Heading level="2">{title}</FormSummary.Heading>
                    {/*</HStack>
                    //TODO: make this a grid? to bring it closer */}
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
                                        readOnly={x.name === 'elev'}
                                        description={
                                            x.name === 'elev' ? 'Tilpasset tilgangskontroll' : ''
                                        }
                                        checked={x.enabled}>
                                        {x.name}
                                    </Checkbox>

                                    <Button
                                        icon={<ChevronRightCircleIcon title="Rediger" />}
                                        onClick={() => onSelected(x.name)}
                                        variant={'tertiary'}
                                        size={'xsmall'}
                                        // disabled={!x.enabled}
                                    />

                                    {/*<ChevronRightCircleIcon*/}
                                    {/*    title="Vis detaljer"*/}
                                    {/*    onClick={() => onSelected(x.name)}*/}
                                    {/*/>*/}
                                    {/*</Box>*/}
                                    {/*</HStack>*/}
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
