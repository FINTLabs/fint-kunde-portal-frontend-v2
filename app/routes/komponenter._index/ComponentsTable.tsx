import React from 'react';
import { Box, Detail, HGrid, Label, Switch, Table } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { useLoaderData, useNavigate } from '@remix-run/react'; // Import HStack

interface ComponentsSectionProps {
    components?: IComponent[];
    selectedComponents: string[];
    columns?: number;
}

const ComponentsTable: React.FC<ComponentsSectionProps> = ({ selectedComponents, columns = 1 }) => {
    const navigate = useNavigate();

    const { components } = useLoaderData<{ components: IComponent[] }>();

    selectedComponents = selectedComponents
        ? selectedComponents
        : components
              .filter(
                  (component) => component.organisations.some((org) => org.includes('fintlabs')) // TODO: fiks hard coded org name
              )
              .map((component) => component.dn);

    const sortedComponents = [...components].sort((a, b) => a.name.localeCompare(b.name));

    const handleRowClick = (component: IComponent) => {
        navigate(`/komponenter/${component.name}`);
    };

    return (
        <>
            <Box padding="4">
                <HGrid gap="8" columns={columns}>
                    <Table>
                        <Table.Body>
                            {sortedComponents.map((component, index) => (
                                <Table.Row key={index} onClick={() => handleRowClick(component)}>
                                    <Table.DataCell>
                                        <Label>{component.description}</Label>
                                        <Detail>{component.basePath}</Detail>
                                    </Table.DataCell>
                                    <Table.DataCell width={160}>
                                        <Switch
                                            checked={selectedComponents.includes(component.dn)}
                                            onChange={() => {}}
                                            hideLabel={true}>
                                            {component.dn}
                                        </Switch>
                                    </Table.DataCell>
                                    <Table.DataCell>
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
