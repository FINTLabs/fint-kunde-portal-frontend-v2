import AccessApi from '~/api/AccessApi';

export async function handleFieldAccessAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    switch (actionType) {
        case 'ENABLE_FIELD':
            return await AccessApi.updateFieldAccess(
                formData.get('username') as string,
                formData.get('componentName') as string,
                formData.get('resourceName') as string,
                formData.get('fieldName') as string,
                formData.get('enabled') as string
            );

        case 'SAVE_FIELDS':
            return await AccessApi.addFieldAccess(
                formData.get('username') as string,
                formData.get('componentName') as string,
                formData.get('resourceName') as string,
                JSON.parse(formData.get('fields') as string)
            );

        case 'UPDATE_RESOURCE': {
            const enabledFlag = formData.get('enabled') === 'true';
            const username = formData.get('username') as string;
            const component = formData.get('componentName') as string;
            const resource = formData.get('resourceName') as string;
            const writeable = formData.get('writeable') === 'true';
            const readingOption = formData.get('readingOption') as string;

            const resourceData = {
                component: component,
                resource: resource,
                enabled: enabledFlag,
                writeable: writeable,
                readingOption: readingOption,
            };
            return await AccessApi.updateResources(username, component, [resourceData]);
        }

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }
}
