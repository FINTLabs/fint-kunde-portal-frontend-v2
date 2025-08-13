import type { LoaderFunction } from 'react-router';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import AdapterAPI from '~/api/AdapterApi';

export const loader: LoaderFunction = async ({ request }) => {
    const orgName = await getSelectedOrganization(request);
    const adaptersResponse = await AdapterAPI.getAdapters(orgName);

    const adapters = adaptersResponse.data || [];
    adapters.sort((a: { shortDescription: string }, b: { shortDescription: string }) =>
        a.shortDescription.localeCompare(b.shortDescription)
    );

    return Response.json({ adapters, orgName });
};
