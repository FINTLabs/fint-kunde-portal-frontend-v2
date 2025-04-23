export async function handleAccessElementAction({ request }: { request: Request }) {
    const formData = await request.formData();
    const actionType = formData.get('actionType');
    const checkMarkValue = formData.get('checkMarkValue');

    switch (actionType) {
        case 'TOGGLE_ELEMENT': {
            const variant = checkMarkValue === 'on' ? 'success' : 'warning';
            return {
                success: true,
                message: `Check mark clicked: ${checkMarkValue}`,
                variant,
            };
        }

        case 'ADD_POLICY':
            return {
                success: true,
                message: `Add policy clicked`,
                variant: 'error',
            };

        default:
            return {
                success: false,
                message: `Ukjent handlingstype: ${actionType}`,
                variant: 'error',
            };
    }
}
