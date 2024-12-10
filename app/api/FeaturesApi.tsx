import { apiManager, ApiResponse, handleApiResponse } from '~/api/ApiManager';
import { FeatureFlags } from '~/types/FeatureFlag';

const API_URL = process.env.API_URL;

class FeaturesApi {
    static async fetchFeatures(): Promise<ApiResponse<FeatureFlags>> {
        const apiResults = await apiManager<FeatureFlags>({
            method: 'GET',
            url: `${API_URL}/api/api/feature`,
            functionName: 'fetchFeatures',
        });

        return handleApiResponse<FeatureFlags>(
            apiResults,
            'Kunne ikke hente en liste over features',
            'Features hentet vellykket'
        );
    }
}

export default FeaturesApi;
