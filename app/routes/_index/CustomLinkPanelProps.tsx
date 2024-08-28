import React from 'react';
import { LinkPanel, BodyLong } from '@navikt/ds-react';

interface CustomLinkPanelProps {
    href: string;
    title: string;
    IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Typing for SVG icons
    description?: string; // Optional description
}

const CustomLinkPanel: React.FC<CustomLinkPanelProps> = ({
    href,
    title,
    IconComponent,
    description,
}) => {
    return (
        <LinkPanel href={href} border className="my-custom-panel">
            <LinkPanel.Title className="panel-title">
                <IconComponent aria-hidden className="panel-icon" />
                {title}
            </LinkPanel.Title>
            {description && <BodyLong className="panel-description">{description}</BodyLong>}
        </LinkPanel>
    );
};

export default CustomLinkPanel;
