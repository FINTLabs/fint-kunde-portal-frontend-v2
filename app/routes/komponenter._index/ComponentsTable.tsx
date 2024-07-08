import React from 'react';
import { Box, Detail, HGrid, Label, Switch, Table } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react'; // Import HStack

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

    const handleRowClick = (component: IComponent) => {
        navigate(`/komponenter/${component.name}`);
    };

    return (
        <>
            <Box padding="4">
                <HGrid gap="8" columns={columns}>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader sortKey="status" sortable>
                                    Status
                                </Table.ColumnHeader>
                                <Table.ColumnHeader scope="col" colSpan={2} sortKey="name" sortable>
                                    Navn
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {components.map((component, index) => (
                                <Table.Row key={index} onClick={() => handleRowClick(component)}>
                                    <Table.DataCell width={60}>
                                        <Switch
                                            checked={selectedComponents.includes(component.dn)}
                                            onChange={() => {}}
                                            hideLabel={true}>
                                            {component.dn}
                                        </Switch>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <Label>{component.description}</Label>
                                        <Detail>{component.basePath}</Detail>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {' '}
                                        <ChevronRightIcon title="a11y-title" fontSize="1.5rem" />
                                    </Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </HGrid>
            </Box>
        </>
    );
};

export default ComponentsTable;
