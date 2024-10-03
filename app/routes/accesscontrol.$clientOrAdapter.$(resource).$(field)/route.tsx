import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon, KeyVerticalIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, HGrid, Spacer } from '@navikt/ds-react';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { IFetcherResponseData } from '~/types/types';
import AccessApi from '~/api/AccessApi';
import FieldList from '~/routes/accesscontrol.$clientOrAdapter.$(resource).$(field)/FieldList';
import ResourcesList from '~/routes/accesscontrol.$clientOrAdapter.$(resource).$(field)/ResourcesList';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const clientOrAdapter = params.clientOrAdapter || '';
    const resource = params.resource || '';
    const field = params.field || '';

    const url = new URL(request.url);
    const entity = url.searchParams.get('entity');
    console.log('Resource:', resource, 'clientOrAdapter:', entity, 'Field:', field);

    let resourceList;
    let fieldList;

    if (entity) {
        if (field) {
            // If field exists, get field-specific access
            fieldList = await AccessApi.getFieldAccess(clientOrAdapter, resource, field);
        } else {
            // If no field, get the component access
            resourceList = await AccessApi.getComponentAccess(clientOrAdapter, resource);
        }
    }

    return json({
        resourceList, // This will be undefined if field exists
        fieldList, // This will be undefined if field does not exist
        clientOrAdapter,
    });
};

export default function Index() {
    const { resourceList, clientOrAdapter, fieldList } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const [show, setShow] = React.useState(false);
    const fetcher = useFetcher<IFetcherResponseData>();
    const actionData = fetcher.data as IFetcherResponseData;

    const [selectedResource, setSelectedResource] = useState<string>();

    const breadcrumbs = [
        // ...(adapterName
        //     ? [
        //           {
        //               name:
        //                   adapterName.length > 10
        //                       ? `${adapterName.substring(0, 10)}...`
        //                       : adapterName,
        //               link: `/adapter/${adapterName}`,
        //           },
        //       ]
        //     : []),
        // ...(clientName
        //     ? [
        //           {
        //               name:
        //                   clientName.length > 10 ? `${clientName.substring(0, 10)}...` : clientName,
        //               link: `/klienter/${clientName}`,
        //           },
        //       ]
        //     : []),
        {
            name: selectedResource ? 'Utdanning Elev ...' : 'Tilgangskontroll Utdanning Elev',

            link: selectedResource ? 'test.abc' : '', // Set link to 'test.abc' if selectedResource exists
        },
        ...(selectedResource ? [{ name: 'Elev', link: '' }] : []), // Add 'Elev' item when selectedResource is present
    ];

    // const backButtonPath = adapterName
    //     ? `/adapter/${adapterName}`
    //     : clientName
    //       ? `/klient/${clientName}`
    //       : '/accesscontrol';
    //
    // const getLabelAndValue = () => {
    //     if (adapterName) {
    //         return { label: 'Adapter', value: adapterName };
    //     } else if (clientName) {
    //         return { label: 'Klienter', value: clientName };
    //     }
    //     return { label: '', value: '' };
    // };

    // const { label, value } = getLabelAndValue();

    useEffect(() => {
        setShow(true);
    }, [fetcher.state]);

    const handleSelectedResource = (resourceName: string) => {
        console.debug('...........', resourceName);
        // setSelectedResource(resourceName);
        navigate(
            `/accesscontrol//fint-samtykke-service-backend-client-ymlez@client.fintlabs.no/${resourceName}?entity=utdanning_vurdering`
        );
        setShow(false);
    };

    const handleSaveFields = (formData: { resourceId: string }) => {
        console.info('handle save fields in route clicked');
        // const updatedFormData = { ...formData, actionType: 'SAVE_FIELDS' };
        fetcher.submit(formData, {
            method: 'post',
            // action: `/accesscontrol/utdanning_elev?client=${value}`,
        });
    };

    const handleToggleResource = (formData: { resourceId: string }) => {
        console.info('------- resource checkmark clicked access route');
        const updatedFormData = { ...formData, actionType: 'TOGGLE_RESOURCE' };
        fetcher.submit(updatedFormData, {
            method: 'post',
            // action: `/accesscontrol/utdanning_elev?client=${value}`,
        });
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <InternalPageHeader
                title={`Tilgangskontroll: ${clientOrAdapter}`}
                icon={KeyVerticalIcon}
            />

            <HGrid gap="2" align={'start'}>
                <Box>
                    <Button
                        className="relative h-12 w-12 top-2 right-14"
                        icon={<ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />}
                        variant="tertiary"
                        onClick={() => navigate('backButtonPath')}></Button>
                </Box>

                <Box
                    className="w-full relative bottom-12"
                    padding="6"
                    borderRadius="large"
                    shadow="small">
                    <Spacer />

                    {actionData && show && (
                        <Alert
                            className={'!mt-5'}
                            variant={actionData.variant as 'error' | 'info' | 'warning' | 'success'}
                            closeButton
                            onClose={() => setShow(false)}>
                            {actionData.message || 'Content'}
                        </Alert>
                    )}

                    {/*<Heading size={'small'}>{value}</Heading>*/}

                    <Box padding="4">
                        {selectedResource ? (
                            <FieldList
                                onSave={handleSaveFields}
                                selectedResource={selectedResource}
                                type={clientOrAdapter || ''}
                                fieldList={fieldList || []} // Pass the dynamic fieldList
                            />
                        ) : (
                            <ResourcesList
                                accessComponent={resourceList}
                                clientOrAdapter={clientOrAdapter || ''}
                                onSelected={handleSelectedResource}
                                onToggle={handleToggleResource}
                            />
                        )}
                    </Box>
                </Box>
            </HGrid>
        </>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    let response;
    switch (actionType) {
        case 'TOGGLE_RESOURCE':
            response = {
                show: true,
                message: 'Access Control updated (not really)',
                variant: 'info',
            };
            break;
        case 'SAVE_FIELDS':
            response = {
                show: true,
                message: 'Fields access updated (not really)',
                variant: 'info',
            };
            break;
        case 'TOGGLE_NUMBER_POSTINGS':
            response = {
                show: true,
                message: 'Multiple or single postings updated (not really)',
                variant: 'info',
            };
            break;
        case 'TOGGLE_ACCESS':
            response = {
                show: true,
                message: 'Access rights updated (not really)',
                variant: 'info',
            };
            break;
        default:
            return json({ show: true, message: 'Unknown action type', variant: 'error' });
    }

    return json({ show: true, message: response?.message, variant: response?.variant });
}
