import { PersonGroupIcon, PersonSuitIcon, PlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { type ApiResponse, NovariToaster, useAlerts } from 'novari-frontend-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ActionFunction, type MetaFunction, useFetcher, useLoaderData } from 'react-router';

import Breadcrumbs from '~/components/shared/breadcrumbs';
import { handleContactsAction } from '~/routes/kontakter/actions';
import ContactModal from '~/routes/kontakter/ContactModal';
import ContactTable from '~/routes/kontakter/ContactTable';
import { IContact } from '~/types/Contact';
import { IRole } from '~/types/Role';

import { loader } from './loaders';
import { InternalPageHeader } from '~/components/shared/InternalPageHeader';

interface IPageLoaderData {
    technicalContacts?: IContact[] | string;
    rolesData?: IRole[];
    allContacts?: IContact[];
    error?: string;
    selectedOrg: string;
    legalContact?: IContact;
}

export const meta: MetaFunction = () => {
    return [{ title: 'Kontakter' }, { name: 'description', content: 'Liste over kontakter' }];
};

export const action: ActionFunction = async ({ request }) => {
    return await handleContactsAction(request);
};

export { loader };

export default function Index() {
    const { t } = useTranslation();
    const breadcrumbs = [{ name: t('menu.contacts'), link: '/kontakter' }];
    const { legalContact, technicalContacts, allContacts, rolesData, selectedOrg } =
        useLoaderData<IPageLoaderData>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const fetcher = useFetcher();
    const actionData = fetcher.data as ApiResponse<IContact>;

    const { alertState } = useAlerts<IContact>([], actionData, fetcher.state);
    const handleFormSubmit = (formData: FormData) => {
        fetcher.submit(formData, { method: 'post', action: '/kontakter' });
    };

    function handleAddContact(formData: FormData) {
        formData.append('actionType', 'ADD_TECHNICAL_CONTACT');
        fetcher.submit(formData, {
            method: 'post',
        });
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={t('menu.contacts')} icon={PersonGroupIcon} helpText="contacts">
                <Button
                    data-cy="add-contact-button"
                    size="small"
                    onClick={() => setIsModalOpen(true)}
                    icon={<PlusIcon aria-hidden />}>
                    {t('mainRoutes.contacts.addButton')}
                </Button>
            </InternalPageHeader>

            <NovariToaster items={alertState} position={'top-right'} />

            <VStack gap="space-16">
                <Box padding="space-24" borderColor="brand-blue" borderWidth="2" borderRadius="12">
                    <Heading size="xsmall">{t('mainRoutes.contacts.legalContactHeading')}</Heading>
                    {legalContact ? (
                        <HStack gap="space-4" align="center" className="px-4">
                            <PersonSuitIcon className="h-10 w-10 bg-slate-200 rounded-full " />
                            <BodyShort size="medium">
                                {legalContact.firstName} {legalContact.lastName}
                            </BodyShort>
                        </HStack>
                    ) : (
                        <BodyShort size="medium">{t('mainRoutes.contacts.noLegalContact')}</BodyShort>
                    )}
                </Box>
                <Box
                    padding="space-16"
                    borderColor="neutral-subtle"
                    borderWidth="2"
                    borderRadius="12">
                    {technicalContacts && typeof technicalContacts !== 'string' && (
                        <ContactTable
                            contactsData={technicalContacts}
                            rolesData={rolesData}
                            onButtonClick={handleFormSubmit}
                            selectedOrg={selectedOrg}
                        />
                    )}
                    <ContactModal
                        data-cy="contact-modal"
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        contacts={allContacts || []}
                        onAddContact={handleAddContact}
                    />
                </Box>
            </VStack>
        </>
    );
}
