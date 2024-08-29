import React, { useState } from 'react';
import { Button, Modal, Heading } from '@navikt/ds-react';

interface AdditionalInput {
    name: string;
    value: string;
}

interface ConfirmActionProps {
    actionText?: string; // Optional with default value "Delete"
    targetName: string; // Explicitly defining type as string
    f: any; // Replace `any` with the actual type
    actionType: string;
    confirmationText: string;
    additionalInputs?: AdditionalInput[];
}

const ConfirmAction: React.FC<ConfirmActionProps> = ({
    actionText = 'Delete',
    targetName,
    f, // Consider replacing `any` with a specific type
    actionType,
    confirmationText,
    additionalInputs = [],
}) => {
    const [open, setOpen] = useState(false);

    const handleClose = (isConfirmed: boolean) => {
        console.info(actionType + ' confirmed: ', isConfirmed);
        setOpen(false);
        //todo: the form is not closing after the action is confirmed
    };

    return (
        <>
            <Button
                variant={actionType === 'delete' ? 'danger' : 'primary'}
                size="xsmall"
                onClick={() => setOpen(true)}>
                {actionText}
            </Button>

            <Modal
                open={open}
                header={{
                    heading: 'Confirmation',
                    size: 'small',
                }}
                width="small"
                onClose={() => handleClose(false)}>
                <Modal.Body>
                    <Heading size="small">{confirmationText}</Heading>
                    <Heading size="medium" spacing>
                        {targetName}
                    </Heading>
                </Modal.Body>
                <Modal.Footer>
                    <f.Form method="post">
                        <input type="hidden" name="actionType" value={actionType} />
                        <input type="hidden" name={`${actionType}Name`} value={targetName} />
                        {additionalInputs.map((input, index) => (
                            <input
                                key={index}
                                type="hidden"
                                name={input.name}
                                value={input.value}
                            />
                        ))}
                        <Button type="submit" variant="danger" onClick={() => handleClose(true)}>
                            Ja, jeg er sikker
                        </Button>
                    </f.Form>

                    <Button type="button" variant="secondary" onClick={() => handleClose(false)}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ConfirmAction;
