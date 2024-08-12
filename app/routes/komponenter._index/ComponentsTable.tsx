import React, { useEffect, useState } from 'react';
import {
    Box,
    Checkbox,
    CheckboxGroup,
    Detail,
    FormSummary,
    Heading,
    HGrid,
    HStack,
    Label,
    Loader,
    Switch,
    Table,
    Tag,
} from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';

interface ComponentsSectionProps {
    items: IComponent[];
    selectedItems: string[];
    columns?: number;
    selectable?: boolean;
    toggle?: (name: string, checked: boolean) => void;
}

type ComponentType = {
    [type: string]: IComponent[];
};

const ComponentsTable: React.FC<ComponentsSectionProps> = ({
    items,
    selectedItems,
    columns = 1,
    toggle,
}) => {
    const navigate = useNavigate();

    const sortedComponents = items.sort((a, b) => a.name.localeCompare(b.name));

    const handleRowClick = (component: IComponent) => {
        navigate(`/komponenter/${component.name}`);
    };

    // Function to split components into chunks
    const chunkArray = (array: IComponent[], chunkSize: number) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const componentChunks = chunkArray(
        sortedComponents,
        Math.ceil(sortedComponents.length / columns)
    );

    const groupedByType = items.reduce((acc: ComponentType, item: IComponent) => {
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
                        .filter((item) => selectedItems.includes(item.dn))
                        .map((item) => item.name);
                    return (
                        <FormSummary key={`${groupName}-${i}`}>
                            <FormSummary.Header>
                                <HStack align={'center'} justify={'space-between'}>
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
                                        // defaultValue={names}
                                        onChange={(names) => {
                                            console.log(names);
                                        }}
                                        size="small">
                                        {groupComponents.map((item, i) => {
                                            const splitted = item.description.split(' ');

                                            const isComponentOn = selectedItems.some(
                                                (selected) => selected === item.dn
                                            );

                                            const [loadingState, setLoadingState] = useState({
                                                loading: false,
                                                isOn: isComponentOn,
                                            });

                                            // To update switch loading state to false
                                            useEffect(() => {
                                                setLoadingState((prevState) => ({
                                                    ...prevState,
                                                    isOn: isComponentOn,
                                                    loading: false,
                                                }));
                                            }, [isComponentOn]);

                                            return (
                                                <HStack
                                                    key={groupName + i}
                                                    justify={'space-between'}
                                                    align={'center'}>
                                                    <HStack align={'center'} gap={'0'}>
                                                        <Checkbox
                                                            disabled={loadingState.loading}
                                                            value={item.name}
                                                            key={groupName + i}
                                                            onChange={(e) => {
                                                                const checkedStatus =
                                                                    e.target.checked;
                                                                setLoadingState({
                                                                    loading: true,
                                                                    isOn: isComponentOn,
                                                                });
                                                                toggle &&
                                                                    toggle(
                                                                        item.name,
                                                                        checkedStatus
                                                                    );
                                                            }}>
                                                            {' '}
                                                        </Checkbox>
                                                        <HStack gap={'1'}>
                                                            {splitted.length > 1
                                                                ? splitted[1]
                                                                : splitted[0]}
                                                            {loadingState.loading && <Loader />}
                                                        </HStack>
                                                    </HStack>
                                                    <HStack align={'center'}>
                                                        <Box
                                                            padding={'2'}
                                                            className="hover:bg-[--a-surface-active] hover:cursor-pointer">
                                                            <ChevronRightIcon
                                                                title="Vis detaljer"
                                                                onClick={() => handleRowClick(item)}
                                                            />
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

            <Box padding="10"></Box>
            <Divider />
            <Box padding="10"></Box>

            <Heading size="large">Old view</Heading>
            <Box padding="10"></Box>
            <HGrid gap="8" columns={columns}>
                {componentChunks.map((chunk, chunkIndex) => (
                    <Table key={chunkIndex} size={'small'}>
                        <Table.Body>
                            {chunk.map((item, index) => {
                                const isComponentSwitchedOn = selectedItems.some(
                                    (selected) => selected === item.dn
                                );

                                const [switchLoadingState, setSwitchLoadingState] = useState({
                                    loading: false,
                                    isOn: isComponentSwitchedOn,
                                });

                                // To update switch loading state to false
                                useEffect(() => {
                                    setSwitchLoadingState((prevState) => ({
                                        ...prevState,
                                        isOn: isComponentSwitchedOn,
                                        loading: false,
                                    }));
                                }, [isComponentSwitchedOn]);

                                return (
                                    <Table.Row key={index}>
                                        <Table.DataCell>
                                            <Switch
                                                loading={switchLoadingState.loading}
                                                checked={isComponentSwitchedOn}
                                                onChange={(e) => {
                                                    const checkedStatus = e.target.checked;
                                                    // console.log(item.name);
                                                    setSwitchLoadingState({
                                                        loading: true,
                                                        isOn: isComponentSwitchedOn,
                                                    });
                                                    toggle && toggle(item.name, checkedStatus);
                                                }}>
                                                {''}
                                            </Switch>
                                        </Table.DataCell>
                                        <Table.DataCell onClick={() => handleRowClick(item)}>
                                            <Label>{item.description}</Label>
                                            <Detail>{item.basePath}</Detail>
                                        </Table.DataCell>
                                        <Table.DataCell onClick={() => handleRowClick(item)}>
                                            {item.common && (
                                                <Tag variant="info" size={'xsmall'}>
                                                    Felles
                                                </Tag>
                                            )}
                                        </Table.DataCell>
                                        <Table.DataCell onClick={() => handleRowClick(item)}>
                                            {item.openData && (
                                                <Tag variant="neutral" size={'xsmall'}>
                                                    Åpne Data
                                                </Tag>
                                            )}
                                        </Table.DataCell>
                                        <Table.DataCell onClick={() => handleRowClick(item)}>
                                            <ChevronRightIcon
                                                title="a11y-title"
                                                fontSize="1.5rem"
                                            />
                                        </Table.DataCell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>
                ))}
            </HGrid>
        </Box>
    );
};

export default ComponentsTable;

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
