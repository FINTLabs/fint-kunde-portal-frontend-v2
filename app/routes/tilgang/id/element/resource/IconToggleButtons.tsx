import React, { useState } from 'react';
import { HStack } from '@navikt/ds-react';
import { CodeIcon, EthernetIcon, NotePencilDashIcon, NotePencilIcon } from '@navikt/aksel-icons';
import ConfirmAction from '~/components/shared/ConfirmActionModal';

interface IconToggleButtonsProps {
    resourceName: string;
    onConfirmPosting: () => void;
    onConfirmAccess: () => void;
}
const IconToggleButtons = ({
    resourceName,
    onConfirmPosting,
    onConfirmAccess,
}: IconToggleButtonsProps) => {
    const [isPencilIcon, setIsPencilIcon] = useState(true);
    const [isBookmarkIcon, setIsBookmarkIcon] = useState(true);

    const handleConfirmPosting = () => {
        console.debug('------- confirmed!');
        setIsBookmarkIcon((prev) => !prev);
        onConfirmPosting();
    };

    const handleConfirmAccess = () => {
        console.debug('------- confirmed!');
        setIsPencilIcon((prev) => !prev);
        onConfirmAccess();
    };

    return (
        <HStack gap={'10'}>
            <ConfirmAction
                buttonText={isPencilIcon ? 'Skriverettighet' : 'Ingen skriverettighet'}
                titleText={resourceName}
                onConfirm={handleConfirmAccess}
                subTitleText={
                    isPencilIcon ? ' Fjern all skriverettighet?' : 'Gi full skriverettighet?'
                }
                icon={
                    isPencilIcon ? (
                        <NotePencilIcon aria-hidden />
                    ) : (
                        <NotePencilDashIcon aria-hidden />
                    )
                }
            />

            <ConfirmAction
                buttonText={isBookmarkIcon ? 'Kun enkeltoppslag' : 'Flere oppslag tillatt'}
                titleText={resourceName}
                onConfirm={handleConfirmPosting}
                subTitleText={
                    isBookmarkIcon ? ' Tillat flere oppslag?' : 'Tillat kun enkeltoppslag?'
                }
                icon={isBookmarkIcon ? <CodeIcon aria-hidden /> : <EthernetIcon aria-hidden />}
            />
        </HStack>
    );
};

export default IconToggleButtons;
