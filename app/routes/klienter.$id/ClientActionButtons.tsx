import React from 'react';
import { Button } from '@navikt/ds-react';
import { FloppydiskIcon, PencilIcon, TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import ConfirmAction from '~/components/shared/ConfirmActionModal';

interface ClientActionButtonsProps {
    isEditing: boolean;
    handleSave: () => void;
    handleCancel: () => void;
    setIsEditing: (value: boolean) => void;
    clientManaged: boolean;
    handleConfirmDelete: () => void;
}

const ClientActionButtons: React.FC<ClientActionButtonsProps> = ({
    isEditing,
    handleSave,
    handleCancel,
    setIsEditing,
    clientManaged,
    handleConfirmDelete,
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
                !clientManaged && (
                    <>
                        <Button
                            icon={<PencilIcon title="Edit" />}
                            variant="tertiary"
                            onClick={() => setIsEditing(true)}
                        />
                        <ConfirmAction
                            buttonText={'delete'}
                            titleText={'Delete adapter'}
                            showButtonText={false}
                            subTitleText={'Are you sure you want to delete this adapter?'}
                            onConfirm={handleConfirmDelete}
                            buttonVariant="tertiary"
                            buttonSize={'medium'}
                            icon={<TrashIcon aria-hidden />}
                        />
                    </>
                )
            )}
        </>
    );
};

export default ClientActionButtons;
