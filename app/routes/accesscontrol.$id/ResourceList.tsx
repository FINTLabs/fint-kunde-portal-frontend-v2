import React from 'react';
import { Button, Checkbox, FormSummary, HStack } from '@navikt/ds-react';
import { IComponentConfig } from '~/types/ComponentConfig';
import { ChevronRightCircleIcon } from '@navikt/aksel-icons';

interface ConfigClassTableProps {
    matchedConfig: IComponentConfig;
    type: string;
    onSelected: (fieldName: string) => void;
    onToggle: (formData: { resourceId: string }) => void;
}

const ResourcesTable: React.FC<ConfigClassTableProps> = ({
    matchedConfig,
    type,
    onSelected,
    onToggle,
}) => {
    const data = matchedConfig.classes;

    function handleCheckbox() {
        const formData = {
            resourceId: 'newServiceName',
        };
        onToggle(formData);
    }

    return (
        <>
            <FormSummary key={`x`}>
                <FormSummary.Header>
                    {/*<HStack align={'center'} justify={'space-between'}>*/}
                    <FormSummary.Heading level="2">Customize: {type}</FormSummary.Heading>
                    {/*</HStack>
                    //TODO: make this a grid? to bring it closer */}
                </FormSummary.Header>
                <FormSummary.Answers>
                    <FormSummary.Answer>
                        {data.map((x, i) => {
                            return (
                                <HStack key={x.path + i} justify={'space-between'} align={'center'}>
                                    {/*<HStack align={'center'} gap={'0'}>*/}
                                    <Checkbox
                                        onChange={handleCheckbox}
                                        // value={x.name}
                                        key={x.name + i}
                                        readOnly={x.name === 'elev'}
                                        // checked={x.name === 'elev'}
                                        description={
                                            x.name === 'elev' ? 'Tilpasset tilgangskontroll' : ''
                                        }>
                                        {x.name}
                                    </Checkbox>
                                    {/*</HStack>*/}
                                    {/*<HStack align={'center'}>*/}
                                    {/*<Box*/}
                                    {/*    padding={'2'}*/}
                                    {/*    className="hover:bg-[--a-surface-active] hover:cursor-pointer">*/}
                                    <Button
                                        icon={<ChevronRightCircleIcon title="Rediger" />}
                                        onClick={() => onSelected(x.name)}
                                        variant={'tertiary'}
                                        size={'xsmall'}
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
export default ResourcesTable;
