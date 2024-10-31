import {
    type ActionFunctionArgs,
    json,
    type LoaderFunctionArgs,
    type MetaFunction,
    redirect,
} from '@remix-run/node';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import { MigrationIcon } from '@navikt/aksel-icons';
import { useFetcher, useLoaderData, useParams } from '@remix-run/react';
import { AdapterDetail } from './AdapterDetail';
import { IAdapter, IFetcherResponseData } from '~/types/types';
import ComponentApi from '~/api/ComponentApi';
import AdapterApi from '~/api/AdapterApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { InfoBox } from '~/components/shared/InfoBox';
import FeaturesApi from '~/api/FeaturesApi';
import AccessApi from '~/api/AccessApi';
import { IAccess } from '~/types/Access';
import { handleApiResponse } from '~/utils/handleApiResponse';
import React, { useEffect } from 'react';
import AdapterAPI from '~/api/AdapterApi';
import { Alert } from '@navikt/ds-react';
import logger from '~/utils/logger';

export const meta: MetaFunction = () => {
    return [{ title: 'Adapter Detaljer' }, { name: 'description', content: 'Adapter Detaljer' }];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    try {
        const orgName = await getSelectedOrganization(request);
        const adapterName = params.name;

        const [adapters, components, features] = await Promise.all([
            AdapterApi.getAdapters(orgName),
            ComponentApi.getOrganisationComponents(orgName),
            FeaturesApi.fetchFeatures(),
        ]);

        let access;
        if (adapterName && features['access-controll-new']) {
            access = await AccessApi.getClientorAdapterAccess(adapterName);
        }

        return json({ adapters, components, features, access, orgName });
    } catch (error) {
        console.error('Error fetching data:', error);

        throw new Response('Kunne ikke laste data. Vennligst prøv igjen senere.', { status: 500 });
    }
};

export default function Index() {
    // TODO: get adapter based on ID.
    const { adapters, features, access } = useLoaderData<{
        adapters: IAdapter[];
        features: Record<string, boolean>;
        access: IAccess[];
    }>();
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;

    const { name } = useParams();
    const hasAccessControl = features['access-controll-new'];
    const breadcrumbs = [
        { name: 'Adaptere', link: '/adaptere' },
        { name: `${name}`, link: `/adapter/${name}` },
    ];

    const filteredAdapters = adapters.filter((a) => a.name === name);
    const adapter = filteredAdapters.length > 0 ? filteredAdapters[0] : null;
    const displayName = adapter?.name.split('@')[0] || '';
    const [show, setShow] = React.useState(false);

    useEffect(() => {
        setShow(true);
    }, [fetcher.state]);

    const handleUpdate = (formData: FormData) => {
        setShow(false);
        console.info('Updating adapter with:', Object.fromEntries(formData.entries()));
        formData.append('actionType', 'UPDATE_ADAPTER');
        fetcher.submit(formData, { method: 'post' });
    };

    const handleDelete = (formData: FormData) => {
        setShow(false);
        formData.append('actionType', 'DELETE_ADAPTER');
        fetcher.submit(formData, { method: 'post' });
        console.info('Deleting adapter with:', Object.fromEntries(formData.entries()));
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader
                title={displayName}
                icon={MigrationIcon}
                helpText="adapter detaljer"
            />
            {!adapter && (
                <InfoBox
                    message={`Det finnes ingen adapter ved navn ${name} i listen over adaptere`}
                />
            )}

            {actionData && show && (
                <Alert
                    className={'!mt-5'}
                    variant={actionData.variant as 'error' | 'info' | 'warning' | 'success'}
                    closeButton
                    onClose={() => setShow(false)}>
                    {actionData.message || 'Innhold'}
                </Alert>
            )}

            {adapter && (
                <AdapterDetail
                    adapter={adapter}
                    hasAccessControl={hasAccessControl}
                    access={access}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}

export async function action({ request, params }: ActionFunctionArgs) {
    const name = params.name;

    if (!name) {
        return json({ error: 'No adapter name in params' }, { status: 400 });
    }

    const formData = await request.formData();
    const orgName = await getSelectedOrganization(request);
    const actionType = formData.get('actionType') as string;

    let response;
    let updateResponse;
    switch (actionType) {
        case 'UPDATE_PASSWORD':
            updateResponse = await AdapterApi.setPassword(
                formData.get('entityName') as string,
                formData.get('password') as string,
                orgName
            );
            response = handleApiResponse(updateResponse, 'Ressurser password oppdatert');
            break;
        case 'GET_SECRET':
            updateResponse = await AdapterApi.getOpenIdSecret(
                formData.get('adapterName') as string,
                orgName
            );
            return json({
                clientSecret: await updateResponse,
                message: 'Adapter secret fetched successfully',
                variant: 'success',
                show: true,
            });
        case 'UPDATE_ADAPTER':
            await AdapterAPI.updateAdapter(
                {
                    name: formData.get('adapterName') as string,
                    shortDescription: formData.get('shortDescription') as string,
                    note: formData.get('note') as string,
                },
                orgName
            );
            return json({
                show: true,
                message: `Adapter oppdatert`,
                variant: 'success',
            });
        case 'DELETE_ADAPTER':
            response = await AdapterAPI.deleteAdapter(name, orgName);
            logger.debug('ADAPTER RESPONSE ON DELETE', response);
            return redirect(`/adaptere?deleted=${name}`);
        default:
            return json({
                show: true,
                message: `Unknown action type '${actionType}'`,
                variant: 'error',
            });
    }
    return json(response);
}
