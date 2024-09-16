import React, { useState } from 'react';
import { HStack } from '@navikt/ds-react';
import { CodeIcon, EthernetIcon, NotePencilDashIcon, NotePencilIcon } from '@navikt/aksel-icons';
import ConfirmAction from '~/components/shared/ConfirmActionModal';
import { log } from '~/utils/logger';

interface IconToggleButtonsProps {
    resourceName: string;
    onConfirmPosting: () => void;
    onConfirmAccess: () => void;
}
const IconToggleButtons: React.FC<IconToggleButtonsProps> = ({
    resourceName,
    onConfirmPosting,
    onConfirmAccess,
}) => {
    const [isPencilIcon, setIsPencilIcon] = useState(true);
    const [isBookmarkIcon, setIsBookmarkIcon] = useState(true);

    const handleConfirmPosting = () => {
        log('------- confirmed!');
        setIsBookmarkIcon((prev) => !prev);
        onConfirmPosting();
    };

    const handleConfirmAccess = () => {
        log('------- confirmed!');
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
