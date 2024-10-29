import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import AccessApi from '~/api/AccessApi';
import ResourcesList from '~/routes/tilgang/id/element/ResourcesList';
import React from 'react';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const clientOrAdapter = params.id || '';
    const element = params.element || '';

    let resourceList = await AccessApi.getComponentAccess(element, clientOrAdapter);

    return json({
        clientOrAdapter,
        resourceList,
        element,
    });
};

export default function Route() {
    const { clientOrAdapter, resourceList, element } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    const handleSelectedResource = (resourceName: string) => {
        console.debug('...........', resourceName);
        // setSelectedResource(resourceName);
        navigate(`/tilgang/${clientOrAdapter}/${element}/${resourceName}`);
        // setShow(false);
    };

    function handleToggleResource() {}

    return (
        <div>
            <h1>{clientOrAdapter}</h1>
            <h1>{element}</h1>

            <ResourcesList
                accessComponent={resourceList}
                clientOrAdapter={clientOrAdapter || ''}
                onSelected={handleSelectedResource}
                onToggle={handleToggleResource}
            />
        </div>
    );
}
