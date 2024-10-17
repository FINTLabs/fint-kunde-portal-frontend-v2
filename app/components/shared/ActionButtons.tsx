import React from 'react';
import { Button } from '@navikt/ds-react';
import { FloppydiskIcon, PencilIcon, TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import ConfirmAction from '~/components/shared/ConfirmActionModal';

interface ActionButtonsProps {
    isEditing: boolean;
    handleSave: () => void;
    handleCancel: () => void;
    setIsEditing: (value: boolean) => void;
    handleConfirmDelete: () => void;
    nameText: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    isEditing,
    handleSave,
    handleCancel,
    setIsEditing,
    handleConfirmDelete,
    nameText,
}) => {
    return (
        <>
            {isEditing ? (
                <>
                    <Button
                        icon={<FloppydiskIcon title="Save" />}
                        variant="tertiary"
                        onClick={handleSave}
                    />
                    <Button
                        icon={<XMarkIcon title="Cancel" fontSize="1.5rem" />}
                        variant="tertiary"
                        onClick={handleCancel}
                    />
                </>
            ) : (
                <>
                    <Button
                        icon={<PencilIcon title="Edit" />}
                        variant="tertiary"
                        onClick={() => setIsEditing(true)}
                    />
                    <ConfirmAction
                        buttonText={'fjerne'}
                        // titleText={'Fjerne klient'}
                        showButtonText={false}
                        subTitleText={`Er du sikker på at du vil fjerne ${nameText}?`}
                        onConfirm={handleConfirmDelete}
                        buttonVariant="tertiary"
                        buttonSize={'medium'}
                        icon={<TrashIcon aria-hidden />}
                    />
                </>
            )}
        </>
    );
};

export default ActionButtons;
