import {Box, Table} from "@navikt/ds-react";
import {json, useLoaderData, useOutletContext} from "@remix-run/react";
import ContactApi from "~/api/contact-api";
import {IContact, UserSession} from "~/api/types";
import {getSession} from "~/utils/session";
import {LoaderFunctionArgs} from "@remix-run/node";

interface IPageLoaderData {
    contactsData?: IContact[];
    error?: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {

    const session = await getSession(request.headers.get("Cookie"));
    const userSession: UserSession = session.get("user-session");

    try {
        if (!userSession?.selectedOrganization) {
            return json({ error: "No organization selected" }, { status: 400 });
        }

        const contactsData = await ContactApi.fetchTechnicalContacts(userSession.selectedOrganization.name);
        // const contactsData = await ContactApi.fetch();
        return json({ contactsData });
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Response("Not Found", { status: 404 });
    }
};

export default function Index() {
    const userSession = useOutletContext<UserSession>();
    const  data  = useLoaderData<IPageLoaderData>();

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
                Welcome {userSession?.firstName} {userSession?.lastName},
                you are part of {userSession?.organizationCount} organization(s).
                {userSession.selectedOrganization?.name} is currently selected.
            </Box>

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
                                <Table.HeaderCell scope="row">{row.firstName} {row.lastName}</Table.HeaderCell>
                                <Table.DataCell>{row.mobile}</Table.DataCell>
                                <Table.DataCell>{row.technical}</Table.DataCell>
                            </Table.Row>

                    ))}
                </Table.Body>
            </Table>
        </>
    );
}
