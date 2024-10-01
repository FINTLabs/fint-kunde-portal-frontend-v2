// utils/handleApiResponse.ts

export const handleApiResponse = (apiResponse: Response, successMessage: string) => {
    if (apiResponse.ok) {
        return {
            message: successMessage,
            variant: 'success',
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
