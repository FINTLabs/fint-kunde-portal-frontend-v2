import AccessApi from '~/api/AccessApi';

export async function handleFieldAccessAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    switch (actionType) {
        case 'ENABLE_FIELD':
            return await AccessApi.updateFieldAccess(
                formData.get('username') as string,
                formData.get('component') as string,
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

        case 'SET_IS_WRITEABLE':
            const isWriteable = formData.get('isWriteable') === 'true';

            return await AccessApi.updateResource(
                formData.get('username') as string,
                formData.get('componentName') as string,
                formData.get('resourceName') as string,
                { isWriteable: isWriteable }
            );
        case 'SET_READING_OPTION':
            const readingOption = formData.get('readingOption') as string;

            return await AccessApi.updateResource(
                formData.get('username') as string,
                formData.get('componentName') as string,
                formData.get('resourceName') as string,
                { readingOption: readingOption }
            );

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }
}
