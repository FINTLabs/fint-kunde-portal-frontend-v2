export async function handleFieldAccessAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    switch (actionType) {
        case 'SAVE_FIELDS':
            return {
                success: true,
                message: `Save fields clicked`,
                variant: 'warning',
            };

        case 'CONFIRM_POSTING':
            return {
                success: true,
                message: `Confirm posting clicked`,
                variant: 'warning',
            };

        case 'CONFIRM_ACCESS':
            return {
                success: true,
                message: `Confirm access clicked`,
                variant: 'warning',
            };

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: '${actionType}'`,
                variant: 'error',
            };
    }
}
