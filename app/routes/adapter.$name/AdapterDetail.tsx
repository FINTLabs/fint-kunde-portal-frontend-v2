import { BodyLong, Box, Button, HStack, Heading, Label, VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { PencilIcon } from '@navikt/aksel-icons';

export function AdapterDetail({ adapter }: { adapter: IAdapter }) {
    const navigate = useNavigate();

    console.log(adapter);
    return (
        <Box>
            <HStack>
                <VStack>
                    <Button
                        icon={<ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />}
                        variant="tertiary"
                        onClick={() => navigate(`/adaptere`)}></Button>
                </VStack>
                <VStack className="flex flex-grow">
                    <Box
                        className="w-full"
                        padding="6"
                        borderRadius="large"
                        shadow="small"
                        background="surface-subtle">
                        <VStack gap="5">
                            <Heading size="medium" spacing>
                                {adapter.note}
                            </Heading>
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
                            <VStack>
                                <Label>Komponenter:</Label>
                                <BodyLong>Display chips here</BodyLong>
                                <Divider className="pt-3" />
                            </VStack>
                            <VStack>
                                <Label>Authentisering:</Label>
                                <BodyLong>Display auth here</BodyLong>
                                <Divider className="pt-3" />
                            </VStack>
                        </VStack>
                        {/* Add more fields as needed */}
                    </Box>
                </VStack>
            </HStack>
        </Box>
    );
}
