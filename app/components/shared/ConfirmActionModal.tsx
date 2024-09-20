import React, { useState } from 'react';
import { Button, Modal, Heading } from '@navikt/ds-react';

interface ConfirmActionProps {
    buttonText?: string;
    titleText?: string;
    subTitleText: string;
    onConfirm: () => void;
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
    titleText,
    onConfirm,
    subTitleText,
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
                size="xsmall"
                onClick={() => setOpen(true)}>
                {buttonText}
            </Button>

            <Modal
                open={open}
                header={{
                    heading: 'Bekreftelse',
                    size: 'small',
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
                    <Button type="submit" variant="danger" onClick={() => handleClose(true)}>
                        Ja, jeg er sikker
                    </Button>

                    <Button type="button" variant="secondary" onClick={() => handleClose(false)}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ConfirmAction;
