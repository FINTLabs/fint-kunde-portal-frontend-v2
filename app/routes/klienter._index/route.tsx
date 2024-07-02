import React from 'react';
import { json, useLoaderData, useNavigate } from '@remix-run/react';
import ClientApi from '~/api/ClientApi';
import { IClient } from '~/types/Clients';
import ClientTable from '~/routes/klienter._index/ClientTable';

export const loader = async () => {
    const organisation = 'fintlabs_no'; // Replace with actual organisation identifier

    try {
        const clientData = await ClientApi.getClients(organisation);
        return json(clientData);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export default function Index() {
    const clientData = useLoaderData<IClient[]>();
    const navigate = useNavigate();

    const handleRowClick = (client: IClient) => {
        navigate(`/klienter/${client.name}`);
    };

    return (
        <>
            <ClientTable clients={clientData} onRowClick={handleRowClick} />
        </>
    );
}
