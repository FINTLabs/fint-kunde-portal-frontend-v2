export const handleApiResponse = (
    apiResponse: Response,
    successMessage: string,
    variant?: 'success' | 'warning' | 'error' | 'info'
) => {
    if (apiResponse.ok) {
        return {
            message: successMessage,
            variant: variant || 'success',
        };
    } else {
        return {
            message: `Error updating. More info: Status: ${apiResponse.status}. StatusText: ${apiResponse.statusText}`,
            variant: 'error',
        };
    }
};
