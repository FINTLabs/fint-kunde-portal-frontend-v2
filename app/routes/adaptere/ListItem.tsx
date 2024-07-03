import { BodyLong, Box, HStack, Label, VStack } from '@navikt/ds-react';
import { IAdapter } from '~/types/types';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { useNavigate } from '@remix-run/react';

export function ListItem({ adapter }: { adapter: IAdapter }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/adapter/${adapter.name}`);
    };

    return (
        <Box
            onClick={handleClick}
            className="hover:bg-[--a-surface-subtle] active:bg-[--a-surface-active] hover:cursor-pointer"
            borderRadius="large"
            shadow="xsmall"
            background="surface-transparent"
            padding="6">
            <HStack className="!flex !justify-between">
                <VStack>
                    <Label>{adapter.shortDescription}</Label>
                    <BodyLong>{adapter.name}</BodyLong>
                </VStack>
                <VStack className="!flex !justify-center pr-3">
                    <ChevronRightIcon title="Høyre peker" fontSize="1.7rem" />
                </VStack>
            </HStack>
        </Box>
    );
}
