import { BodyLong, Box, Button, Chips, HStack, Heading, Label, VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';
import Divider from 'node_modules/@navikt/ds-react/esm/dropdown/Menu/Divider';
import { PencilIcon } from '@navikt/aksel-icons';

const comps = [
    {
        name: 'Administrasjon Fullmakt',
    },
    {
        name: 'Administrasjon Kodeverk',
    },
];

function ComponentsList({ selected }: { selected: string[] }) {
    return (
        <Chips size="small">
            {comps.map((c, index) => (
                <Chips.Toggle
                    selected={true}
                    key={index}
                    onClick={() => {
                        // do something
                    }}>
                    {c.name}
                </Chips.Toggle>
            ))}
        </Chips>
    );
}
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
                                <Label>Authentisering:</Label>
                                <BodyLong>Display auth here</BodyLong>
                                {/* <Divider className="pt-3" /> */}
                            </VStack>
                        </VStack>
                        {/* Add more fields as needed */}
                    </Box>
                </VStack>
            </HStack>
        </Box>
    );
}