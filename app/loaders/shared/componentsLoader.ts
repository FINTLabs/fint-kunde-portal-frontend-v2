import { json } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/node';
import ComponentApi from '~/api/ComponentApi';

export const fetchComponentsLoader: LoaderFunction = async () => {
    try {
        const components = await ComponentApi.getAllComponents();
        return json({ components });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};
