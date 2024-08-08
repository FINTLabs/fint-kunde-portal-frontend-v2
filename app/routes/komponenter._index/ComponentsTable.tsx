import React, { useEffect, useState } from 'react';
import { Box, Detail, HGrid, Label, Switch, Table, Tag } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';

interface ComponentsSectionProps {
    items: IComponent[];
    selectedItems: string[];
    columns?: number;
    selectable?: boolean;
    toggleSwitch?: (name: string, checked: boolean) => void;
}

type ComponentType = {
    [type: string]: IComponent[];
};

const ComponentsTable: React.FC<ComponentsSectionProps> = ({
    items,
    selectedItems,
    columns = 1,
    toggleSwitch,
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

    console.log(groupedByType);

    return (
        <>
            <Box padding="4">
                <HGrid gap="8" columns={columns}>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell />
                                <Table.HeaderCell scope="col">Komponent type</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {Object.keys(groupedByType).map((key, i) => {
                                const componentType = key;
                                const groupComponents = groupedByType[key];
                                const Comp = () => {
                                    return groupComponents.map((item, i) => (
                                        <div>
                                            {capitalizeFirstLetter(item.name.split('_')[1] ?? '')}
                                        </div>
                                    ));
                                };
                                return (
                                    <Table.ExpandableRow key={i} content={<Comp />}>
                                        <Table.DataCell scope="row">
                                            {capitalizeFirstLetter(componentType)}
                                        </Table.DataCell>
                                    </Table.ExpandableRow>
                                );
                            })}
                        </Table.Body>
                    </Table>

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
                                                        console.log(item.name);
                                                        setSwitchLoadingState({
                                                            loading: true,
                                                            isOn: isComponentSwitchedOn,
                                                        });
                                                        toggleSwitch &&
                                                            toggleSwitch(item.name, checkedStatus);
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
        </>
    );
};

export default ComponentsTable;

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
