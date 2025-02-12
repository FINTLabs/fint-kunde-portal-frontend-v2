import { LoaderFunction } from 'react-router';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import LinkWalkerApi from '~/api/LinkWalkerApi';

export const loader: LoaderFunction = async ({ request, params }) => {
    const { id } = params;

    if (!id) {
        throw new Response(JSON.stringify({ error: 'Missing id parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const orgName = await getSelectedOrganization(request);

    try {
        // Call your API to get the Excel file download URL
        const downloadUrl = LinkWalkerApi.getLink(orgName, id);

        if (!downloadUrl) {
            throw new Response(JSON.stringify({ error: 'Excel file not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Fetch the Excel file from the download URL
        const response = await fetch(downloadUrl);

        if (!response.ok) {
            throw new Response(JSON.stringify({ error: 'Failed to download Excel file' }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const excelFileBuffer = await response.arrayBuffer();

        return new Response(excelFileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="relasjonstest_${id}.xlsx"`,
            },
        });
    } catch (error) {
        console.error('Error fetching Excel file:', error);
        throw new Response(JSON.stringify({ error: 'Failed to fetch Excel file' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
