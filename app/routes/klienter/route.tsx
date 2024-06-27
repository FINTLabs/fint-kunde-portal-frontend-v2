import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
    return [{ title: 'Klienter' }, { name: 'description', content: 'Liste over klienter' }];
};

export default function Index() {
    return (
        <div className="font-sans p-4">
            <h1 className="text-3xl">Velkomment til klienter :)</h1>
        </div>
    );
}
