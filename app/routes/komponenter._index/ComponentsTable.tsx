import React from 'react';
import { Box, Checkbox, CheckboxGroup, FormSummary, HGrid, HStack } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import { ChevronRightIcon, KeyVerticalIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';

interface ComponentsSectionProps {
    items: IComponent[];
    selectedItems: string[];
    columns?: number;
    selectable?: boolean;
    toggle?: (name: string, checked: boolean) => void;
    hideLink?: boolean;
    adapterName?: string;
    clientName?: string;
}

type ComponentType = {
    [type: string]: IComponent[];
};

const ComponentsTable: React.FC<ComponentsSectionProps> = ({
    items,
    selectedItems,
    toggle,
    hideLink = false,
    adapterName,
    clientName,
}) => {
    const navigate = useNavigate();

    const sortedComponents = items.sort((a, b) => a.name.localeCompare(b.name));

    const handleRowClick = (component: IComponent) => {
        if (hideLink) {
            if (adapterName) {
                navigate(`/accesscontrol/${component.name}?adapter=${adapterName}`);
            } else if (clientName) {
                navigate(`/accesscontrol/${component.name}?client=${clientName}`);
            }
        } else {
            navigate(`/komponenter/${component.name}`);
        }
    };

    const groupedByType = sortedComponents.reduce((acc: ComponentType, item: IComponent) => {
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
                    const selectedItemsInGroupNames = groupComponents
                        .filter((item) => selectedItems.includes(item.name))
                        .map((item) => item.name);
                    return (
                        <FormSummary key={`${groupName}-${i}`}>
                            <FormSummary.Header>
                                <HStack align={'center'} justify={'space-between'}>
                                    {hideLink && (
                                        <KeyVerticalIcon title="key icon" fontSize="1.5rem" />
                                    )}
                                    <FormSummary.Heading level="2">
                                        {capitalizeFirstLetter(groupName)}
                                    </FormSummary.Heading>
                                </HStack>
                            </FormSummary.Header>

                            <FormSummary.Answers>
                                <FormSummary.Answer>
                                    <CheckboxGroup
                                        hideLegend
                                        value={selectedItemsInGroupNames}
                                        legend={groupName.toUpperCase()}
                                        onChange={() => {}}
                                        size="small">
                                        {groupComponents.map((item, i) => {
                                            const splitted = item.description.split(' ');

                                            return (
                                                <HStack
                                                    key={groupName + i}
                                                    justify={'space-between'}
                                                    align={'center'}>
                                                    <HStack align={'center'} gap={'0'}>
                                                        <Checkbox
                                                            value={item.name}
                                                            key={groupName + i}
                                                            onChange={(e) => {
                                                                const checkedStatus =
                                                                    e.target.checked;
                                                                toggle &&
                                                                    toggle(
                                                                        item.name,
                                                                        checkedStatus
                                                                    );
                                                            }}>
                                                            {splitted.length > 1
                                                                ? splitted[1]
                                                                : splitted[0]}
                                                        </Checkbox>
                                                    </HStack>
                                                    <HStack align={'center'}>
                                                        <Box
                                                            padding={'2'}
                                                            className="hover:bg-[--a-surface-active] hover:cursor-pointer">
                                                            {!hideLink && (
                                                                <ChevronRightIcon
                                                                    title="ChevronRightIcon"
                                                                    fontSize="1.5rem"
                                                                    onClick={() =>
                                                                        handleRowClick(item)
                                                                    }
                                                                />
                                                            )}
                                                        </Box>
                                                    </HStack>
                                                </HStack>
                                            );
                                        })}
                                    </CheckboxGroup>
                                </FormSummary.Answer>
                            </FormSummary.Answers>
                        </FormSummary>
                    );
                })}
            </HGrid>

            <Divider />
        </Box>
    );
};

export default ComponentsTable;

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
