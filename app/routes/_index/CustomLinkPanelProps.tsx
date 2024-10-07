import React from 'react';
import { LinkPanel, BodyLong } from '@navikt/ds-react';

interface CustomLinkPanelProps {
    href: string;
    title: string;
    IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    description?: string;
    userHasRole: boolean;
}

const CustomLinkPanel: React.FC<CustomLinkPanelProps> = ({
    href,
    title,
    IconComponent,
    description,
    userHasRole,
}) => {
    return (
        <LinkPanel
            href={userHasRole ? href : undefined}
            border
            className={userHasRole ? 'my-custom-panel' : 'my-custom-panel-disabled'}>
            <LinkPanel.Title
                className={`panel-title ${!userHasRole ? 'panel-title-disabled' : ''}`}>
                <IconComponent
                    aria-hidden
                    className={`panel-icon ${!userHasRole ? 'panel-icon-disabled' : ''}`}
                />
                {title}
            </LinkPanel.Title>
            {description && (
                <BodyLong
                    className={`panel-description ${!userHasRole ? 'panel-description-disabled' : ''}`}>
                    {description}
                </BodyLong>
            )}
        </LinkPanel>
    );
};

export default CustomLinkPanel;
