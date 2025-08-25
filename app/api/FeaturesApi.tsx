import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';
import type { FeatureFlags } from '~/types/FeatureFlag';
import { HeaderProperties } from '~/utils/headerProperties';

const API_URL = process.env.API_URL || '';
const featuresManager = new NovariApiManager({
    baseUrl: API_URL,
});

class FeaturesApi {
    static async fetchFeatures(): Promise<ApiResponse<FeatureFlags>> {
        return await featuresManager.call<FeatureFlags>({
            method: 'GET',
            endpoint: '/api/api/feature', // NOTE: if this is a typo, change to '/api/feature'
            functionName: 'fetchFeatures',
            customErrorMessage: 'Kunne ikke hente en liste over features',
            customSuccessMessage: 'Features hentet vellykket',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }
}

export default FeaturesApi;
