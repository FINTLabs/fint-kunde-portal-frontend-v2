import React from 'react';
import { Box, Button, Checkbox, FormSummary, HGrid, HStack } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import { ChevronRightCircleIcon, KeyVerticalIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';

interface ComponentListProps {
    items: IComponent[];
    selectedItems: string[];
    onToggle: (name: string, checked: boolean) => void;
    adapterName?: string;
    clientName?: string;
}

type ComponentType = {
    [type: string]: IComponent[];
};

const ComponentList: React.FC<ComponentListProps> = ({
    items,
    selectedItems,
    onToggle,
    adapterName,
    clientName,
}) => {
    const navigate = useNavigate();

    const handleRowClick = (component: IComponent) => {
        if (adapterName) {
            navigate(`/accesscontrol/${component.name}?adapter=${adapterName}`);
        } else if (clientName) {
            navigate(`/accesscontrol/${component.name}?client=${clientName}`);
        }
    };

    const groupedByType = items.reduce((acc: ComponentType, item: IComponent) => {
        items.sort((a, b) => a.name.localeCompare(b.name));
        const componentType = item.basePath.split('/')[1];
        if (!acc[componentType]) {
            acc[componentType] = [];
        }
        acc[componentType].push(item);
        return acc;
    }, {});

    return (
        <Box>
            <HGrid gap={'3'} columns={3}>
                {Object.keys(groupedByType).map((groupName, i) => {
                    const groupComponents = groupedByType[groupName];
                    // const selectedItemsInGroupNames = groupComponents
                    //     .filter((item) => selectedItems.includes(item.name)) // based on components list
                    //     .map((item) => item.name);
                    return (
                        <FormSummary key={`${groupName}-${i}`}>
                            <FormSummary.Header>
                                <HStack align={'center'} justify={'space-between'}>
                                    <KeyVerticalIcon title="a11y-title" fontSize="1.5rem" />
                                    <FormSummary.Heading level="2">
                                        {capitalizeFirstLetter(groupName)}
                                    </FormSummary.Heading>
                                </HStack>
                            </FormSummary.Header>

                            <FormSummary.Answers>
                                <FormSummary.Answer>
                                    {groupComponents.map((item, i) => {
                                        const splitted = item.description.split(' ');

                                        return (
                                            <HStack
                                                key={groupName + i}
                                                justify={'space-between'}
                                                align={'center'}>
                                                <Checkbox
                                                    onClick={() => onToggle(item.name, true)}
                                                    value={item.name}
                                                    size={'small'}
                                                    key={groupName + i}
                                                    readOnly={item.name === 'utdanning_elev'}
                                                    checked={item.name === 'utdanning_elev'}
                                                    description={
                                                        item.name === 'utdanning_elev'
                                                            ? 'tilpasset tilgangskontroll'
                                                            : ''
                                                    }>
                                                    {splitted.length > 1
                                                        ? splitted[1]
                                                        : splitted[0]}
                                                </Checkbox>
                                                <Button
                                                    icon={
                                                        <ChevronRightCircleIcon title="Rediger" />
                                                    }
                                                    onClick={() => handleRowClick(item)}
                                                    variant={'tertiary'}
                                                    size={'xsmall'}
                                                />
                                            </HStack>
                                        );
                                    })}
                                </FormSummary.Answer>
                            </FormSummary.Answers>
                        </FormSummary>
                    );
                })}
            </HGrid>
        </Box>
    );
};

export default ComponentList;

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
