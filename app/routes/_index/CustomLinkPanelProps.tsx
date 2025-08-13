import React from 'react';
import { Box, LinkCard } from '@navikt/ds-react';

interface CustomLinkPanelProps {
    href: string;
    title: string;
    IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const CustomLinkPanel: React.FC<CustomLinkPanelProps> = ({ href, title, IconComponent }) => {
    return (
        <LinkCard>
            <Box
                asChild
                borderRadius="12"
                padding="space-8"
                style={{ backgroundColor: 'var(--ax-bg-moderateA)' }}>
                <LinkCard.Icon>
                    <IconComponent aria-hidden className={`panel-icon`} />
                </LinkCard.Icon>
            </Box>
            <LinkCard.Title>
                <LinkCard.Anchor href={href} data-cy={`${title}-link-panel`}>
                    {title}
                </LinkCard.Anchor>
            </LinkCard.Title>
        </LinkCard>
        // <LinkPanel
        //     key={title}
        //     border
        //     className={'my-custom-panel'}
        //     href={href}
        //     data-cy={`${title}-link-panel`}>
        //     <LinkPanel.Title className={`panel-title`}>
        //         <IconComponent aria-hidden className={`panel-icon`} />
        //         {title}
        //     </LinkPanel.Title>
        //     {description && <BodyLong className={`panel-description`}>{description}</BodyLong>}
        // </LinkPanel>
    );
};

export default CustomLinkPanel;
