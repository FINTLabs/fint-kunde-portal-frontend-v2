import { type LoaderFunction, type MetaFunction } from '@remix-run/node';
import { LayersIcon } from '@navikt/aksel-icons';
import React from 'react';
import { json, useLoaderData, useNavigate } from '@remix-run/react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import AccessApi from '~/api/AssetApi';
import { IAsset } from '~/types/Asset';
import { getSelectedOprganization } from '~/utils/selectedOrganization';
import { Table } from '@navikt/ds-react';

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
    const breadcrumbs = [{ name: 'ressurser', link: '/ressurser._index' }];
    const assets = useLoaderData<IAsset[]>();
    console.log(assets);

    const navigate = useNavigate();

    const handleClick = (id: string) => {
        navigate(`/ressurser/${id}`);
    };
    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Ressurser'} icon={LayersIcon} helpText="assets" />

            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Beskrivelse</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {assets.map((item, i) => (
                        <Table.Row
                            key={i + item.dn}
                            className="active:bg-[--a-surface-active] hover:cursor-pointer"
                            onClick={() => handleClick(item.name)}>
                            <Table.DataCell scope="row">{item.name}</Table.DataCell>
                            <Table.DataCell scope="row">{item.description}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    );
}
