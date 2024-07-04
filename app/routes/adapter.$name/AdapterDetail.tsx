import {
    BodyLong,
    BodyShort,
    Box,
    Button,
    Chips,
    CopyButton,
    HStack,
    Heading,
    Label,
    VStack,
} from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { useNavigate } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { ThumbUpIcon, ArrowCirclepathIcon, PencilIcon, ArrowLeftIcon } from '@navikt/aksel-icons';

export function AdapterDetail({ adapter }: { adapter: IAdapter }) {
    const navigate = useNavigate();

    console.log(adapter);
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
                                <LabelValuePair
                                    label="Passord"
                                    value={'*********'}
                                    displayRefreshButton
                                />
                                <LabelValuePair label="Klient ID" value={adapter.clientId} />
                                {/* <Divider className="pt-3" /> */}
                            </VStack>
                        </VStack>
                    </Box>
                </VStack>
            </HStack>
        </Box>
    );

    function LabelValuePair({
        label,
        value,
        displayRefreshButton,
    }: {
        label: string;
        value: string;
        displayRefreshButton?: boolean;
    }) {
        return (
            <HStack className="flex !justify-between !items-center">
                <HStack gap="4">
                    <Label>{label}</Label>
                    <BodyShort>{value}</BodyShort>
                </HStack>
                <HStack className=" flex !items-center">
                    {displayRefreshButton && (
                        <Button
                            variant="tertiary-neutral"
                            icon={<ArrowCirclepathIcon title="Refresh" fontSize="1.5rem" />}
                            onClick={() => alert('not yet implemented')}
                        />
                    )}
                    <CopyButton
                        copyText={value}
                        // text="Kopier"
                        activeText={`${label} er kopiert!`}
                        activeIcon={<ThumbUpIcon aria-hidden />}
                    />
                </HStack>
            </HStack>
        );
    }
}
