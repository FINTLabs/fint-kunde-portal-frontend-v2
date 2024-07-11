import React from 'react';
import { Box, Chips, Detail, HGrid, Label, Switch, Table, Tag } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';

interface ComponentsSectionProps {
    components: IComponent[];
    selectedComponents: string[];
    columns?: number;
}

const ComponentsTable: React.FC<ComponentsSectionProps> = ({
    components,
    selectedComponents,
    columns = 1,
}) => {
    const navigate = useNavigate();

    const sortedComponents = components.sort((a, b) => a.name.localeCompare(b.name));

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

    return (
        <>
            <Box padding="4">
                <HGrid gap="8" columns={columns}>
                    {componentChunks.map((chunk, chunkIndex) => (
                        <Table key={chunkIndex}>
                            <Table.Body>
                                {chunk.map((component, index) => (
                                    <Table.Row
                                        key={index}
                                        onClick={() => handleRowClick(component)}>
                                        {/*<Table.DataCell>*/}
                                        {/*    /!*<Label>{component.description}</Label>*!/*/}
                                        {/*    <Detail>{component.basePath}</Detail>*/}
                                        {/*</Table.DataCell>*/}
                                        <Table.DataCell>
                                            <Switch
                                                checked={selectedComponents.includes(component.dn)}
                                                onChange={() => {}}
                                                // hideLabel={true}
                                                // position="right"
                                            >
                                                <Label>{component.description}</Label>
                                                <Detail>{component.basePath}</Detail>
                                            </Switch>
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {component.common && (
                                                <Tag variant="info" size={'xsmall'}>
                                                    Felles
                                                </Tag>
                                            )}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {component.openData && (
                                                <Tag variant="neutral" size={'xsmall'}>
                                                    Åpne Data
                                                </Tag>
                                            )}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <ChevronRightIcon
                                                title="a11y-title"
                                                fontSize="1.5rem"
                                            />
                                        </Table.DataCell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    ))}
                </HGrid>
            </Box>
        </>
    );
};

export default ComponentsTable;
