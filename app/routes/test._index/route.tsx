// routes/subpage.tsx
import { Box, Table } from '@navikt/ds-react';
import { json, useFetcher, useLoaderData, useOutletContext, Form } from '@remix-run/react';
import { ActionFunction, ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getSession, commitSession } from '~/utils/session';
import ContactApi from '~/api/ContactApi';
import { log } from '~/utils/logger';
import type { IContact, UserSession } from '~/api/types';

interface IPageLoaderData {
    contactsData?: IContact[];
    error?: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'));
    const userSession: UserSession = session.get('user-session');

    try {
        if (!userSession?.selectedOrganization) {
            return json({ error: 'No organization selected' }, { status: 400 });
        }

        const contactsData = await ContactApi.fetchTechnicalContacts(
            userSession.selectedOrganization.name
        );
        return json({ contactsData });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export async function action({ request }: ActionFunctionArgs) {
    log('Action called');
    const formData = await request.formData();
    const selectedOrgName = formData.get('selectedOrg') as string;

    const session = await getSession(request.headers.get('Cookie'));
    const userSession: UserSession = session.get('user-session');

    let selectedOrganization = userSession.organizations.find(
        (org) => org.name === selectedOrgName
    );

    // todo: remove HACK TO TEST!!!!
    if (!selectedOrganization) {
        selectedOrganization = {
            name: 'TEST ORG',
            orgNumber: '99999999999',
            displayName: 'Test Organization',
        };
    }

    log('Selected organization:', selectedOrganization);
    if (selectedOrganization) {
        userSession.selectedOrganization = selectedOrganization;
        session.set('user-session', userSession);
        const cookie = await commitSession(session);
        return redirect(request.headers.get('Referer') || '/', {
            headers: {
                'Set-Cookie': cookie,
            },
        });
    }

    return json({ error: 'Organization not found' }, { status: 400 });
}

export default function Index() {
    const userSession = useOutletContext<UserSession>();
    const data = useLoaderData<IPageLoaderData>();

    if ('error' in data) {
        return (
            <Box style={{ backgroundColor: '#D5ACB1FF', padding: '1rem' }}>
                <p>Error: {data.error}</p>
            </Box>
        );
    }

    return (
        <>
            <Box style={{ backgroundColor: '#D5ACB1FF', padding: '1rem' }}>
                Welcome {userSession?.firstName} {userSession?.lastName}, you are part of{' '}
                {userSession?.organizationCount} organization(s).{' '}
                {userSession.selectedOrganization?.name} is currently selected.
            </Box>

            {userSession && (
                <Form method="post">
                    <label>
                        Select Organization:
                        <select
                            name="selectedOrg"
                            defaultValue={userSession.selectedOrganization?.name}>
                            <option value="TEST ORG">Test Organization</option>
                            {userSession.organizations.map((org) => (
                                <option key={org.name} value={org.name}>
                                    {org.displayName}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button type="submit">Select</button>
                </Form>
            )}

            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Mobile</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Technical</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data.contactsData?.map((row: IContact, i: number) => (
                        <Table.Row key={i}>
                            <Table.HeaderCell scope="row">
                                {row.firstName} {row.lastName}
                            </Table.HeaderCell>
                            <Table.DataCell>{row.mobile}</Table.DataCell>
                            <Table.DataCell>{row.technical}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    );
}
