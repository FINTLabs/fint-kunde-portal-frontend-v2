import React from 'react';
import { HStack } from '@navikt/ds-react';
import { CodeIcon, EthernetIcon, NotePencilDashIcon, NotePencilIcon } from '@navikt/aksel-icons';
import ConfirmAction from '~/components/shared/ConfirmActionModal';
import { IResource } from '~/types/Access';

interface IconToggleButtonsProps {
    resource: IResource;
    onClickReadingOptions: () => void;
    onClickIsWriteable: () => void;
}
const IconToggleButtons = ({
    resource,
    onClickReadingOptions,
    onClickIsWriteable,
}: IconToggleButtonsProps) => {
    return (
        <HStack gap={'10'} className={'pt-5'}>
            <ConfirmAction
                buttonText={resource.writeable ? 'Skriverettighet' : 'Ingen skriverettighet'}
                titleText={resource.name}
                onConfirm={onClickIsWriteable}
                subTitleText={
                    resource.writeable ? ' Fjern all skriverettighet?' : 'Gi full skriverettighet?'
                }
                icon={
                    resource.writeable ? (
                        <NotePencilIcon aria-hidden />
                    ) : (
                        <NotePencilDashIcon aria-hidden />
                    )
                }
            />

            <ConfirmAction
                buttonText={
                    resource.readingOption === 'SINGULAR'
                        ? 'Kun enkeltoppslag'
                        : 'Flere oppslag tillatt'
                }
                titleText={resource.name}
                onConfirm={onClickReadingOptions}
                subTitleText={
                    resource.readingOption === 'SINGULAR'
                        ? ' Tillat flere oppslag?'
                        : 'Tillat kun enkeltoppslag?'
                }
                icon={
                    resource.readingOption === 'SINGULAR' ? (
                        <CodeIcon aria-hidden />
                    ) : (
                        <EthernetIcon aria-hidden />
                    )
                }
            />
        </HStack>
    );
};

export default IconToggleButtons;
