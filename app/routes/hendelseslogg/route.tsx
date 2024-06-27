import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
    return [
        { title: 'Hendelseslogg' },
        { name: 'description', content: 'Liste over hendelseslogg' },
    ];
};

export default function Index() {
    return (
        <div className="font-sans p-4">
            <h1 className="text-3xl">Velkomment til Hendelseslogg :)</h1>
        </div>
    );
}
