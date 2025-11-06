import { CodeIcon, EthernetIcon, NotePencilDashIcon, NotePencilIcon } from '@navikt/aksel-icons';
import { HStack, Tooltip } from '@navikt/ds-react';
import React from 'react';

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
        <HStack gap={'4'} className={'pb-5 justify-end'}>
            <Tooltip content={resource.writeable ? 'Klikk for å fjerne skriverettighet' : 'Klikk for å gi skriverettighet'}>
                <div>
                    <ConfirmAction
                        buttonText={resource.writeable ? 'Fjern skriverettighet' : 'Gi skriverettighet'}
                        buttonVariant={resource.writeable ? 'secondary' : 'primary'}
                        titleText={`${resource.name} - Endre skriverettighet`}
                        onConfirm={onClickIsWriteable}
                        subTitleText={
                            resource.writeable 
                                ? 'Er du sikker på at du vil fjerne skriverettighet for denne ressursen?' 
                                : 'Er du sikker på at du vil gi skriverettighet for denne ressursen?'
                        }
                        icon={
                            resource.writeable ? (
                                <NotePencilIcon aria-hidden />
                            ) : (
                                <NotePencilDashIcon aria-hidden />
                            )
                        }
                    />
                </div>
            </Tooltip>

            <Tooltip content={
                resource.readingOption === 'SINGULAR' 
                    ? 'Klikk for å tillate flere oppslag' 
                    : 'Klikk for å begrense til enkeltoppslag'
            }>
                <div>
                    <ConfirmAction
                        buttonText={
                            resource.readingOption === 'SINGULAR'
                                ? 'Tillat flere oppslag'
                                : 'Kun enkeltoppslag'
                        }
                        buttonVariant="secondary"
                        titleText={`${resource.name} - Endre leserettighet`}
                        onConfirm={onClickReadingOptions}
                        subTitleText={
                            resource.readingOption === 'SINGULAR'
                                ? 'Er du sikker på at du vil tillate flere oppslag for denne ressursen?'
                                : 'Er du sikker på at du vil begrense til kun enkeltoppslag for denne ressursen?'
                        }
                        icon={
                            resource.readingOption === 'SINGULAR' ? (
                                <EthernetIcon aria-hidden />
                            ) : (
                                <CodeIcon aria-hidden />
                            )
                        }
                    />
                </div>
            </Tooltip>
        </HStack>
    );
};

export default IconToggleButtons;
