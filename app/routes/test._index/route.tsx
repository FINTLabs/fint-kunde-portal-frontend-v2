import {Box, Table} from "@navikt/ds-react";
import {json, useLoaderData} from "@remix-run/react";
import ContactApi from "~/api/contact-api";
import {IContact} from "~/api/types";
import {getSession} from "~/utils/session";
import {log} from "~/utils/logger";
import {LoaderFunctionArgs} from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request.headers.get("Cookie"));
    const userSession = session.get("user-session");
    log("user-session in subpage", userSession);

    try {
        const [contactsData] = await Promise.all([
            ContactApi.fetch(),
        ]);
        return json({ contactsData, userSession });
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Response("Not Found", { status: 404 });
    }
};

export default function Index() {
    // const loaderData = useLoaderData<typeof loader>();
    const { contactsData, userSession } = useLoaderData<typeof loader>();

    return (

        <>
            <Box style={{ backgroundColor: '#D5ACB1FF', padding: '1rem' }}>
                Welcome {userSession.firstName} {userSession.lastName},
                you are part of {userSession.organizationCount} organization(s).
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
                    {contactsData?.map((row: IContact, i: number) => (
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
