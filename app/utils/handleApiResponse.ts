export const handleApiResponse = (
    apiResponse: Response,
    successMessage: string,
    isWarning?: boolean
) => {
    if (apiResponse.ok) {
        return {
            message: successMessage,
            variant: isWarning ? 'warning' : 'success',
            show: true,
        };
    } else {
        return {
            message: `Error updating. More info: Status: ${apiResponse.status}. StatusText: ${apiResponse.statusText}`,
            variant: 'error',
            show: true,
        };
    }
};
//TODO remove show
