import {Box, Table} from "@navikt/ds-react";
import {json, useLoaderData} from "@remix-run/react";
import ContactApi from "~/api/contact-api";
import {IContact} from "~/api/types";

export const loader = async () => {

    try {
        const [contactsData] = await Promise.all([
            ContactApi.fetch(),
        ]);
        return json({contactsData});
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Response("Not Found", {status: 404});
    }
};

export default function Index() {
    const loaderData = useLoaderData<typeof loader>();
    const contactsData = loaderData.contactsData;

    return (

        <>
            <Box style={{ backgroundColor: '#D5ACB1FF', padding: '1rem' }}>
               stuff for this page goes here
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
