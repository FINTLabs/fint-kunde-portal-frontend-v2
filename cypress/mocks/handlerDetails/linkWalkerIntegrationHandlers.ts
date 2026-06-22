import { delay, http, HttpResponse } from 'msw';

import linkwalkerSummary from '../../fixtures/linkwalker-summary.json';
import linkwalkerRows from '../../fixtures/linkwalker-rows.json';
import { LINKWALKER_READER_API_URL } from '../mockConfig';

export const linkWalkerIntegrationHandlers = [
    http.get(`${LINKWALKER_READER_API_URL}/link-walker/report/:orgId/summary`, ({ params }) => {
        const { orgId } = params;

        return HttpResponse.json({
            ...linkwalkerSummary,
            orgId,
        });
    }),

    http.get(
        `${LINKWALKER_READER_API_URL}/link-walker/report/:orgId/rows`,
        async ({ params, request }) => {
            const { orgId } = params;
            const url = new URL(request.url);

            const component = url.searchParams.get('component');
            const resource = url.searchParams.get('resource');
            const problemType = url.searchParams.get('problemType');
            const page = parseInt(url.searchParams.get('page') || '0', 10);
            const size = parseInt(url.searchParams.get('size') || '100', 10);

            const orgRows = linkwalkerRows.rows.filter((row) => row.orgId === orgId);
            let filteredRows = (orgRows.length > 0 ? orgRows : linkwalkerRows.rows).map((row) => ({
                ...row,
                orgId,
            }));

            if (component) {
                filteredRows = filteredRows.filter((row) => row.component === component);
            }

            if (resource) {
                filteredRows = filteredRows.filter((row) => row.resource === resource);
            }

            if (problemType) {
                filteredRows = filteredRows.filter((row) => row.problemType === problemType);
            }

            const totalRows = filteredRows.length;
            const totalPages = Math.ceil(totalRows / size);
            const start = page * size;
            const end = start + size;
            const paginatedRows = filteredRows.slice(start, end);

            await delay(1000);
            return HttpResponse.json({
                rows: paginatedRows,
                page,
                size,
                totalRows,
                totalPages,
            });
        }
    ),
];
