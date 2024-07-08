import {
    type LoaderFunctionArgs,
    json,
    type MetaFunction,
    type ActionFunctionArgs,
} from '@remix-run/node';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    console.log('ADapter secret loader');
    console.log(request);
    console.log(params);
    // const session = await getSession(request.headers.get('Cookie'));
    // const userSession: UserSession | undefined = session.get('user-session');
    // if (!userSession) {
    //     throw new Response('Unauthorized', { status: 401 });
    // }
    return json({});
};

export const meta: MetaFunction = () => {
    return [
        { title: 'Opprett ny adapter' },
        { name: 'description', content: 'Opprett ny adapter' },
    ];
};

export default function Index() {
    const breadcrumbs = [
        { name: 'Adaptere', link: '/adaptere' },
        { name: `Opprett ny adapter`, link: `/adapter/create` },
    ];

    return <>Secret</>;
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    // create adapter based on formaData;

    console.log('formData');
    console.log(formData);
   
    // check if user was created successfully
    return json({ ok: true });
}
