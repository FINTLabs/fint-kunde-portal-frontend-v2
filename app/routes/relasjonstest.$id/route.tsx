import { type LoaderFunction } from 'react-router';

import LinkWalkerApi from '~/api/LinkWalkerApi';
import { getSelectedOrganization } from '~/utils/selectedOrganization';

//TODO: This needs to be testing in a live environment, made changes to error Response that i am not sure work correctly?
//TODO: This can be done better i am sure

export const loader: LoaderFunction = async ({ request, params }) => {
    const { id } = params;

    if (!id) {
        throw Response.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const orgName = await getSelectedOrganization(request);

    try {
        // Call your API to get the Excel file download URL
        const downloadUrl = LinkWalkerApi.getLink(orgName, id);

        if (!downloadUrl) {
            throw Response.json({ error: 'Excel file not found' }, { status: 404 });
        }

        // Fetch the Excel file from the download URL
        const response = await fetch(downloadUrl);

        if (!response.ok) {
            throw Response.json(
                { error: 'Failed to download Excel file' },
                { status: response.status, statusText: response.statusText }
            );
        }

        const excelFileBuffer = await response.arrayBuffer();

        return new Response(excelFileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="relasjonstest_${id}.xlsx"`,
            },
        });
    } catch {
        throw Response.json({ error: 'Failed to fetch Excel file' }, { status: 500 });
    }
};
