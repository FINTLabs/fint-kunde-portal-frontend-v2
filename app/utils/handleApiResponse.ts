export const handleApiResponse = (
    apiResponse: Response,
    successMessage: string,
    isWarning?: boolean
) => {
    if (apiResponse.ok) {
        return {
            message: successMessage,
            variant: isWarning ? 'warning' : 'success',
        };
    } else {
        return {
            message: `Error updating. More info: Status: ${apiResponse.status}. StatusText: ${apiResponse.statusText}`,
            variant: 'error',
        };
    }
};
