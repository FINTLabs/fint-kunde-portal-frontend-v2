import React from 'react';
import { Box, Heading, Hide, HStack, VStack } from "@navikt/ds-react";

type LayoutHeaderProps = {
    icon?: React.ElementType;
    title: string;
};

const InternalHeader: React.FC<LayoutHeaderProps> = ({ icon: IconComponent, title }) => {
    return (
        <Box
            as="header"
            borderWidth="0 0 4 0"
            borderColor="border-info"
        >
            <div className="max-w-5xl">
                <Box paddingInline="4" paddingBlock="0 6">
                    <VStack gap={"3"}>
                        <HStack align="start" gap="8">
                            <Hide below="md">
                                {IconComponent && <IconComponent title="a11y-title" fontSize="3.5rem" />}
                            </Hide>
                            <Heading level="1" size="xlarge">
                                {title}
                            </Heading>
                        </HStack>
                    </VStack>
                </Box>
            </div>
        </Box>
    );
};

export default InternalHeader;
