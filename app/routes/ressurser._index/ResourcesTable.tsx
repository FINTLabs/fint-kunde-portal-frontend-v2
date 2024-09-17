import React from 'react';
import { Box, Detail, HGrid, Label, Switch, Table } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import { ChevronRightIcon } from '@navikt/aksel-icons'; // Import HStack

interface ComponentsSectionProps {
    components: IComponent[];
    selectedComponents: string[];
    columns?: number;
}

const ComponentsList: React.FC<ComponentsSectionProps> = ({
    components,
    selectedComponents,
    columns = 1,
}) => {
    return (
        <>
            {/*<Heading size="medium">Components</Heading>*/}
            <Box
                // background="surface-subtle"
                // borderColor="border-alt-3"
                padding="4"
                // borderWidth="2"
                // borderRadius="xlarge"
            >
                <HGrid gap="8" columns={columns}>
                    <Table size="small">
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
                                <Table.Row key={index}>
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
                                        <ChevronRightIcon title="Vis detaljer" fontSize="1.5rem" />
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

export default ComponentsList;
