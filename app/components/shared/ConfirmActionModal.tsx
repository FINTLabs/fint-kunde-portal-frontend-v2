import React, { useState } from 'react';
import { Button, Modal, Heading } from '@navikt/ds-react';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';

interface ConfirmActionProps {
    buttonText?: string;
    titleText?: string;
    showButtonText?: boolean;
    subTitleText: string;
    onConfirm: () => void;
    buttonSize?: 'xsmall' | 'small' | 'medium';
    buttonVariant?:
        | 'tertiary'
        | 'primary'
        | 'primary-neutral'
        | 'secondary'
        | 'secondary-neutral'
        | 'tertiary-neutral'
        | 'danger';
    icon?: React.ReactNode;
}

const ConfirmAction: React.FC<ConfirmActionProps> = ({
    buttonText = 'Delete',
    showButtonText = true,
    titleText,
    onConfirm,
    subTitleText,
    buttonSize,
    buttonVariant = 'tertiary',
    icon,
}) => {
    const [open, setOpen] = useState(false);

    const handleClose = (isConfirmed: boolean) => {
        setOpen(false);
        if (isConfirmed) onConfirm();
    };

    return (
        <>
            <Button
                variant={
                    buttonVariant as
                        | 'tertiary'
                        | 'primary'
                        | 'primary-neutral'
                        | 'secondary'
                        | 'secondary-neutral'
                        | 'tertiary-neutral'
                        | 'danger'
                }
                icon={icon}
                size={buttonSize ? (buttonSize as 'xsmall' | 'small' | 'medium') : 'xsmall'}
                onClick={() => setOpen(true)}>
                {showButtonText ? buttonText : ''}
            </Button>

            <Modal
                open={open}
                header={{
                    heading: `Bekreftelse`,
                    size: 'small',
                    icon: <ExclamationmarkTriangleIcon />,
                }}
                width="small"
                onClose={() => handleClose(false)}>
                <Modal.Body>
                    <Heading size="small">{titleText}</Heading>
                    <Heading size="medium" spacing>
                        {subTitleText}
                    </Heading>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="submit"
                        variant="danger"
                        onClick={() => handleClose(true)}
                        size={'small'}>
                        Ja, jeg er sikker
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleClose(false)}
                        size={'small'}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ConfirmAction;
