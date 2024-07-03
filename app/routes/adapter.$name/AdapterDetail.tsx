import { BodyLong, Box, Button, HStack, Label } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';

export function AdapterDetail({ adapter }: { adapter: IAdapter }) {
    const navigate = useNavigate();

    return (
        <Box>
            <HStack>
                <Button
                    icon={<ArrowLeftIcon title="a11y-title" fontSize="1.5rem" />}
                    variant="tertiary"
                    onClick={() => navigate(`/adaptere`)}></Button>
            </HStack>
            <Box padding="6" borderRadius="large" shadow="small" background="surface-subtle">
                <HStack>
                    <Label>Client ID:</Label>
                    <BodyLong>{adapter.clientId}</BodyLong>
                </HStack>
                <HStack>
                    <Label>Note:</Label>
                    <BodyLong>{adapter.note}</BodyLong>
                </HStack>
                <HStack>
                    <Label>Assets:</Label>
                    <BodyLong>{adapter.assets.join(', ')}</BodyLong>
                </HStack>
                {/* Add more fields as needed */}
            </Box>
        </Box>
    );
}
