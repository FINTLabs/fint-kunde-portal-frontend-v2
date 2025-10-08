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

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: ${actionType}`,
                variant: 'error',
            };
    }
}
