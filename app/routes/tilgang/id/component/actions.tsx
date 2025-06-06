import AccessApi from '~/api/AccessApi';

export async function handleAccessElementAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    switch (actionType) {
        case 'ENABLE_RESOURCE': {
            const enabledFlag = formData.get('enabled') === 'true';

            return await AccessApi.updateResource(
                formData.get('username') as string,
                formData.get('component') as string,
                formData.get('resource') as string,
                { enabled: enabledFlag }
            );
        }

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: ${actionType}`,
                variant: 'error',
            };
    }
}
