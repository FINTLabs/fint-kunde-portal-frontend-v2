import { redirect } from 'react-router';

import AccessApi from '~/api/AccessApi';

export async function handleAccessElementAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    switch (actionType) {
        case 'ENABLE_RESOURCE': {
            const enabledFlag = formData.get('enabled') === 'true';
            const username = formData.get('username') as string;
            const component = formData.get('component') as string;
            const resource = formData.get('resource') as string;

            const resourceData = {
                component: component,
                resource: resource,
                enabled: enabledFlag,
                writeable: false,
                readingOption: null,
            };

            const response = await AccessApi.updateResources(username, component, [resourceData]);

            if (enabledFlag && response.success) {
                return redirect(`/tilgang/${username}/${component}/${resource}?addedNew=true`);
            }

            return response;
        }

        case 'ENABLE_ALL_RESOURCES':
        case 'DISABLE_ALL_RESOURCES': {
            const username = formData.get('username') as string;
            const component = formData.get('component') as string;
            const resourcesJson = formData.get('resources') as string;

            if (resourcesJson) {
                const resources = JSON.parse(resourcesJson);
                return await AccessApi.updateResources(username, component, resources);
            }

            return {
                success: false,
                message: 'Ingen ressurser å oppdatere',
                variant: 'warning',
            };
        }

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: ${actionType}`,
                variant: 'error',
            };
    }
}
