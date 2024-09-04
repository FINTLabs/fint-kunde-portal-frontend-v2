import React, { useEffect, useState } from 'react';
import { ActionFunctionArgs, LoaderFunction, MetaFunction } from '@remix-run/node';
import { PersonGroupIcon, PersonSuitIcon, PlusIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { json, useFetcher, useLoaderData } from '@remix-run/react';
import ContactApi from '~/api/ContactApi';
import RoleApi from '~/api/RolesApi';
import OrganisationApi from '~/api/OrganisationApi';
import ContactTable from '~/routes/kontakter/ContactTable';
import { log } from '~/utils/logger';
import { IContact, IFetcherResponseData, IRole } from '~/types/types';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ContactModal from '~/routes/kontakter/ContactModal';
import { getSelectedOrganization as getSelectedOrganization } from '~/utils/selectedOrganization';
import { getFormData } from '~/utils/requestUtils';
import { InfoBox } from '~/components/shared/InfoBox';

interface IPageLoaderData {
    technicalContacts?: IContact[] | string;
    rolesData?: IRole[];
    allContacts?: IContact[];
    error?: string;
}

export const meta: MetaFunction = () => {
    return [{ title: 'Kontakter' }, { name: 'description', content: 'Liste over kontakter' }];
};

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const selectedOrg = await getSelectedOrganization(request);

        const technicalContacts = await ContactApi.getTechnicalContacts(selectedOrg);
        const rolesData = await RoleApi.getRoles();
        const legalContact = await OrganisationApi.getLegalContact(selectedOrg);
        const allContacts = await ContactApi.getAllContacts();

        return json({
            technicalContacts,
            rolesData,
            legalContact,
            allContacts,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

export async function action({ request }: ActionFunctionArgs) {
    const actionName = 'Action in kontakter/route.tsx';
    const formData = await request.formData();

    log(formData);
    const actionType = getFormData(formData.get('actionType'), 'actionType', actionName);
    const selectedOrg = await getSelectedOrganization(request);
    const contactNin = getFormData(formData.get('contactNin'), 'contactNin', actionName);

    let response;
    let isOk = false;
    switch (actionType) {
        case 'addTechnicalContact':
            response = await ContactApi.addTechnicalContact(contactNin, selectedOrg);
            isOk = response.status === 204;
            return json({
                ok: isOk,
                show: true,
                message: isOk
                    ? 'Kontakten er lagt til. Husk å tildele roller til kontakten.'
                    : `Legge til kontakt feilet. Mer info: Status: ${response.status}. StatusText ${response.statusText}`,
                variant: isOk ? 'success' : 'error',
            });
        case 'removeTechnicalContact':
            response = await ContactApi.removeTechnicalContact(contactNin, selectedOrg);
            isOk = response.status === 204;
            return json({
                ok: isOk,
                show: true,
                message: isOk
                    ? 'Kontakten er fjernet som teknisk kontakt'
                    : `Fjerning av teknisk kontakt feilet. Mer info: Status: ${response.status}. StatusText ${response.statusText}`,
                variant: isOk ? 'success' : 'error',
            });
        case 'setLegalContact':
            response = await ContactApi.setLegalContact(contactNin, selectedOrg);
            isOk = response.status === 204;
            return json({
                ok: isOk,
                show: true,
                message: isOk
                    ? 'Kontakten er satt som juridisk kontakt'
                    : `Forespørslen feilet. Mer info: Status: ${response.status}. StatusText ${response.statusText}`,
                variant: isOk ? 'success' : 'error',
            });
        case 'addRole':
            let roleIdToAdd = getFormData(formData.get('roleId'), 'roleId', actionName);
            response = await RoleApi.addRole(selectedOrg, contactNin, roleIdToAdd);
            break;
        case 'deleteRole':
            let roleIdToDelete = getFormData(formData.get('roleId'), 'roleId', actionName);
            response = await RoleApi.removeRole(selectedOrg, contactNin, roleIdToDelete);
            break;
        default:
            return json({
                show: true,
                message: `Unknown action type '${actionType}'`,
                variant: 'error',
            });
    }
}

export default function Index() {
    const breadcrumbs = [{ name: 'Kontakter', link: '/kontakter' }];
    const { legalContact, technicalContacts, allContacts, rolesData } = useLoaderData<
        IPageLoaderData & { legalContact?: IContact }
    >();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const fetcher = useFetcher();
    const actionData = fetcher.data as IFetcherResponseData;
    const [show, setShow] = React.useState(false);
    console.log('---------------- action data', actionData);
    useEffect(() => {
        setShow(true);
        setIsModalOpen(false);
    }, [fetcher.state]);

    const handleFormSubmit = (formData: FormData) => {
        // const contactNin = formData.get('contactNin') as string;
        // const actionType = formData.get('actionType') as string;
        //
        // console.log('Saved legal data:', { contactNin, actionType });

        // Assuming fetcher.submit works directly with FormData
        fetcher.submit(formData, { method: 'post', action: '/kontakter' });
    };

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <HStack align={'center'} justify={'space-between'}>
                <VStack>
                    <InternalPageHeader
                        title={'Kontakter'}
                        icon={PersonGroupIcon}
                        helpText="contacts"
                    />
                </VStack>
                <VStack>
                    <Button
                        size="small"
                        onClick={() => setIsModalOpen(true)}
                        icon={<PlusIcon aria-hidden />}>
                        Legg til
                    </Button>
                </VStack>
            </HStack>

            {actionData && show && (
                <Alert
                    variant={actionData.variant as 'error' | 'info' | 'warning' | 'success'}
                    closeButton
                    onClose={() => setShow(false)}>
                    {actionData.message || 'Content'}
                </Alert>
            )}

            <Box className="m-10">
                <Heading size="xsmall">Juridisk kontakt</Heading>
                {legalContact ? (
                    <HStack gap="4" align="center" className="px-4">
                        <PersonSuitIcon className="h-10 w-10 bg-slate-200 rounded-full border-4" />
                        <BodyShort size="medium">{legalContact.firstName}</BodyShort>
                    </HStack>
                ) : (
                    <BodyShort size="medium">Ingen juridisk kontakt funnet</BodyShort>
                )}
            </Box>

            {technicalContacts && typeof technicalContacts === 'string' && (
                <InfoBox message={technicalContacts} />
            )}
            {technicalContacts && typeof technicalContacts !== 'string' && (
                <ContactTable
                    contactsData={technicalContacts}
                    rolesData={rolesData}
                    onButtonClick={handleFormSubmit}
                />
            )}
            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contacts={allContacts || []}
                f={fetcher}
            />
        </>
    );
}
