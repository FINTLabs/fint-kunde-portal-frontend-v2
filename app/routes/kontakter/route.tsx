import React, {useState} from 'react';
import {LoaderFunction, MetaFunction} from '@remix-run/node';
import {PersonGroupIcon, PersonSuitIcon} from '@navikt/aksel-icons';
import {BodyShort, Box, Heading, HStack, InternalHeader, Search, Spacer} from '@navikt/ds-react';
import Breadcrumbs from "~/components/breadcrumbs";
import {getSession} from "~/utils/session";
import type {IContact, IRole} from "~/types/types";
import {json, useLoaderData} from "@remix-run/react";
import ContactApi from "~/api/ContactApi";
import RoleApi from "~/api/RolesApi";
import OrganisationApi from "~/api/OrganisationApi";
import InternalPageHeader from "~/components/InternalPageHeader";
import ContactTable from "~/routes/kontakter/ContactTable";


interface IPageLoaderData {
    contactsData?: IContact[];
    rolesData?: IRole[];
    error?: string;
}

export const meta: MetaFunction = () => {
    return [{title: 'Kontakter'}, {name: 'description', content: 'Liste over kontakter'}];
};

export const loader: LoaderFunction = async ({ request }) => {


    try {
        const session = await getSession(request.headers.get('Cookie'));
        const userSession = session.get('user-session');

        const contactsData = await ContactApi.fetchTechnicalContacts(userSession.selectedOrganization.name);
        const rolesData = await RoleApi.getRoles();
        const legalContact = await OrganisationApi.getLegalContact(userSession.selectedOrganization.name);

        return json({ contactsData, rolesData, legalContact });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};


export default function Index() {
    const breadcrumbs = [{ name: 'Kontakter', link: '/kontakter' }];
    const data = useLoaderData<IPageLoaderData & { legalContact?: IContact }>();
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredContacts = data.contactsData?.filter(contact =>
        contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );



    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            <InternalPageHeader
                title={'Kontakter'}
                icon={PersonGroupIcon}
                helpText="contacts"
            />


            <Box className="m-10">
                <Heading size="xsmall">Juridisk kontakt</Heading>
                {data.legalContact ? (
                    <HStack gap="4" align="center" className="px-4">
                        <PersonSuitIcon className="h-10 w-10 bg-slate-200 rounded-full border-4"/>
                        <BodyShort size="medium">{data.legalContact.firstName}</BodyShort>
                    </HStack>
                ) : (
                    <BodyShort size="medium">Ingen juridisk kontakt funnet</BodyShort>
                )}
            </Box>

            <InternalHeader className={"!bg-gray-400"}>
                <form
                    className="self-center px-5"
                >
                    <Search
                        label="InternalPageHeader søk"
                        size="small"
                        variant="simple"
                        placeholder="Søk"
                        className={"!bg-gray-300"}
                        onChange={(value) => setSearchQuery(value)}
                    />
                </form>
                <Spacer/>
                <InternalHeader.Title href="#home">Add New Contact</InternalHeader.Title>
            </InternalHeader>

            <ContactTable
                contactsData={filteredContacts}
                rolesData={data.rolesData}
            />
        </>
    );
}

export function ErrorBoundary({error}: { error: Error }) {
    return (
        <>
            <p>Something went wrong fetching contacts.</p>
            <p>{error?.message}</p>
        </>
    );
}
