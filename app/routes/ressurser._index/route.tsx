import { type LoaderFunction, type MetaFunction } from '@remix-run/node';
import { LayersIcon } from '@navikt/aksel-icons';
import React from 'react';
import { json, useLoaderData, useNavigate } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AccessApi from '~/api/AssetApi';
import { IAsset } from '~/types/Asset';
import { getSelectedOprganization } from '~/utils/selectedOrganization';
import { BodyShort, Button, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { PlusIcon } from '@navikt/aksel-icons';

export const meta: MetaFunction = () => {
    return [
        { title: 'Ressurser' },
        { name: 'description', content: 'Liste over ressurser._index' },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const orgName = await getSelectedOprganization(request);
        const assets = await AccessApi.getAllAssets(orgName);
        return json(assets);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Ressurser', link: '/ressurser._index' }];
    const assets = useLoaderData<IAsset[]>();

    const navigate = useNavigate();

    const handleClick = (id: string) => {
        navigate(`/ressurser/${id}`);
    };

    const handleCreate = () => {
        navigate(`/ressurser/create`);
    };
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader title={'Ressurser'} icon={LayersIcon} helpText="assets" />
                </VStack>
                <VStack>
                    <Button
                        className="float-right"
                        onClick={handleCreate}
                        icon={<PlusIcon aria-hidden />}>
                        Legg til
                    </Button>
                </VStack>
            </HStack>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {assets.map((item, i) => (
                        <Table.Row
                            key={i + item.dn}
                            className="active:bg-[--a-surface-active] hover:cursor-pointer"
                            onClick={() => handleClick(item.name)}>
                            <Table.DataCell>
                                {/* <Heading size="small">{item.name}</Heading> */}
                                <BodyShort>{item.name}</BodyShort>

                                {/* <BodyShort textColor="subtle">{item.description}</BodyShort> */}
                            </Table.DataCell>
                            <Table.DataCell>
                                {/* <Heading size="small">{item.name}</Heading> */}
                                <BodyShort textColor="subtle">{item.description}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                                <ChevronRightIcon title="vis detaljer" fontSize="1.5rem" />
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    );
}
