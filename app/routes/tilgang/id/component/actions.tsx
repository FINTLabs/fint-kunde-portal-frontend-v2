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

            const response = await AccessApi.updateResource(
                username,
                component,
                resource,
                { enabled: enabledFlag }
            );
            
            if (enabledFlag) {
                return redirect(`/tilgang/${username}/${component}/${resource}`);
            }
            
            return response;
        }

        case 'ENABLE_ALL_RESOURCES':
        case 'DISABLE_ALL_RESOURCES': {
            // TODO: Implement when backend endpoint is ready
            // const enabledFlag = actionType === 'ENABLE_ALL_RESOURCES';
            // const username = formData.get('username') as string;
            // const component = formData.get('component') as string;
            // const response = await AccessApi.updateAllResources(username, component, enabledFlag);
            // return response;
            
            return {
                success: false,
                message: 'Endpoint ikke implementert ennå',
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
