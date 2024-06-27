import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
    return [{ title: 'Samtykke' }, { name: 'description', content: 'Liste over Samtykke' }];
};

export default function Index() {
    return (
        <div className="font-sans p-4">
            <h1 className="text-3xl">Velkomment til Samtykke :)</h1>
        </div>
    );
}
