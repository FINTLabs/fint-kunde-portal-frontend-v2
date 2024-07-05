import { BodyLong, Box, Button, Chips, HStack, Heading, Label, VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useNavigate } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { PencilIcon, ArrowLeftIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { LabelValuePair } from './LabelValuePair';
import AdapterAPI from '~/api/AdapterApi';

export function AdapterDetail({
    adapter,
    organisationName,
}: {
    adapter: IAdapter;
    organisationName: string;
}) {
    const navigate = useNavigate();

    const [clientSecret, setClientSecret] = useState('');
    const [passord, setPassord] = useState('');

    const handleRefreshClientSecret = async () => {
        try {
            setClientSecret('refreshed');
            const secret = await AdapterAPI.getOpenIdSecret(adapter.name, organisationName);
            console.log(secret);
            if (secret) {
                setClientSecret(secret);
            }
        } catch (error) {
            console.error('Error fetching client secret:', error);
        }
    };

    return (
        <Box padding={'2'}>
            <HStack>
                <VStack>
                    <Button
                        icon={<ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />}
                        variant="tertiary"
                        onClick={() => navigate(`/adaptere`)}></Button>
                </VStack>
                <VStack className="flex flex-grow">
                    <Box className="w-full" padding="6" borderRadius="large" shadow="small">
                        <VStack gap="5">
                            {/* <Heading size="medium" spacing>
                                {adapter.note}
                            </Heading> */}
                            <VStack>
                                <Label>Note</Label>
                                <HStack className="!flex !justify-between !items-center">
                                    <BodyLong>{adapter.note}</BodyLong>
                                    <Button
                                        icon={<PencilIcon title="Rediger" />}
                                        variant="tertiary"
                                    />
                                </HStack>
                                <Divider className="pt-3" />
                            </VStack>
                            {/* <VStack>
                                <Label>Komponenter:</Label>
                                <ComponentsList selected={adapter.components} />
                                <Divider className="pt-3" />
                            </VStack> */}
                            <VStack>
                                <Heading size="medium" spacing>
                                    Authentisering
                                </Heading>
                                <LabelValuePair label="Brukernavn" value={adapter.name} />
                                <LabelValuePair label="Klient ID" value={adapter.clientId} />
                                <LabelValuePair label="Passord" value={''} displayRefreshButton />
                                <LabelValuePair
                                    label="Klient Hemmelighet"
                                    value={clientSecret}
                                    displayFetchValue
                                    handleRefresh={handleRefreshClientSecret}
                                />
                                {/* <Divider className="pt-3" /> */}
                            </VStack>
                        </VStack>
                    </Box>
                </VStack>
            </HStack>
        </Box>
    );
}
