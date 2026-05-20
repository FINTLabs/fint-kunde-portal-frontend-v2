import { NovariApiManager, type ApiResponse } from 'novari-frontend-components';

import type { GetRowsParams, LatestReportSummary, PagedRows } from '~/types/LinkWalkerIntegration';
import { HeaderProperties } from '~/utils/headerProperties';

const LINKWALKER_READER_API_URL = process.env.LINKWALKER_READER_API_URL || '';
const linkWalkerManager = new NovariApiManager({
    baseUrl: LINKWALKER_READER_API_URL,
});

class LinkWalkerIntegrationApi {
    static async getSummary(orgId: string): Promise<ApiResponse<LatestReportSummary>> {
        return await linkWalkerManager.call<LatestReportSummary>({
            method: 'GET',
            endpoint: `/link-walker/report/${orgId}/summary`,
            functionName: 'getSummary',
            customErrorMessage: `Kunne ikke hente sammendrag for organisasjonen: ${orgId}`,
            customSuccessMessage: 'Sammendrag hentet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }

    static async getRows(params: GetRowsParams): Promise<ApiResponse<PagedRows>> {
        const { orgId, component, resource, problemType, page = 0, size = 100 } = params;

        const queryParams = new URLSearchParams();
        if (component) queryParams.append('component', component);
        if (resource) queryParams.append('resource', resource);
        if (problemType) queryParams.append('problemType', problemType);
        queryParams.append('page', page.toString());
        queryParams.append('size', size.toString());

        const queryString = queryParams.toString();
        const endpoint = `/link-walker/report/${orgId}/rows${queryString ? `?${queryString}` : ''}`;

        return await linkWalkerManager.call<PagedRows>({
            method: 'GET',
            endpoint,
            functionName: 'getRows',
            customErrorMessage: `Kunne ikke hente rader for organisasjonen: ${orgId}`,
            customSuccessMessage: 'Rader hentet',
            additionalHeaders: {
                'x-nin': HeaderProperties.getXnin(),
            },
        });
    }
}

export default LinkWalkerIntegrationApi;
