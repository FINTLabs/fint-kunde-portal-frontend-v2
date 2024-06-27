import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
    return [{ title: 'Kontakter' }, { name: 'description', content: 'Liste over kontakter' }];
};

export default function Index() {
    return (
        <div className="font-sans p-4">
            <h1 className="text-3xl">Velkomment til kontakter :)</h1>
        </div>
    );
}
