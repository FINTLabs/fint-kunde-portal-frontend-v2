import React from 'react';
import { json, useLoaderData, useNavigate } from '@remix-run/react';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ArrowLeftIcon, ComponentIcon } from '@navikt/aksel-icons';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { Box, Button, Heading, HGrid, Table } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import ComponentApi from '~/api/ComponentApi';
import ComponentDetails from '~/routes/komponenter.$id/ComponentDetails';
import { LoaderFunctionArgs } from '@remix-run/node';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const id = params.id || '';
    try {
        const component = await ComponentApi.getComponentById(id);
        return json(component);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const component = useLoaderData<IComponent>();
    const breadcrumbs = [
        { name: 'Komponenter', link: '/komponenter' },
        { name: component.name, link: `/komponenter/${component.name}` },
    ];
    const navigate = useNavigate();

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={component.name} icon={ComponentIcon} />

            <HGrid columns="50px auto">
                <Box>
                    <Button
                        icon={<ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />}
                        variant="tertiary"
                        onClick={() => navigate(`/komponenter`)}></Button>
                </Box>

                <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                    <Heading size={'medium'}>Details</Heading>
                    <ComponentDetails component={component} />
                    <Divider className="pt-3" />

                    <Heading size={'medium'}>Endepunkter</Heading>
                    <Box padding="4">
                        <Table>
                            <Table.Row>
                                <Table.DataCell>Produksjon</Table.DataCell>
                                <Table.DataCell>
                                    https://api.felleskomponent.no{component.basePath}
                                </Table.DataCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.DataCell>Beta</Table.DataCell>
                                <Table.DataCell>
                                    https://beta.felleskomponent.no{component.basePath}
                                </Table.DataCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.DataCell>Play-with-FINT</Table.DataCell>
                                <Table.DataCell>
                                    https://play-with-fint.felleskomponent.no
                                    {component.basePath}
                                </Table.DataCell>
                            </Table.Row>
                        </Table>
                    </Box>
                    <Heading size={'medium'}>Swagger</Heading>

                    <Box padding="4">
                        <Table>
                            <Table.Row>
                                <Table.DataCell>Produksjon</Table.DataCell>
                                <Table.DataCell>
                                    https://api.felleskomponent.no{component.basePath}
                                    /swagger-ui.html
                                </Table.DataCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.DataCell>Beta</Table.DataCell>
                                <Table.DataCell>
                                    https://beta.felleskomponent.no{component.basePath}
                                    /swagger-ui.html
                                </Table.DataCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.DataCell>Play-with-FINT</Table.DataCell>
                                <Table.DataCell>
                                    https://play-with-fint.felleskomponent.no
                                    {component.basePath}
                                    /swagger-ui.html
                                </Table.DataCell>
                            </Table.Row>
                        </Table>
                    </Box>
                </Box>
            </HGrid>
        </>
    );
}
