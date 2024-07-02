// ConfirmModal.tsx
import React from 'react';
import { Modal, BodyLong, Button } from '@navikt/ds-react';

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    type: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, onClose, onConfirm, type }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            header={{
                heading:
                    type === 'juridisk'
                        ? 'Bekreft endring til juridisk kontakt'
                        : 'Bekreft fjerning av kontakt',
                size: 'small',
                closeButton: false,
            }}
            width="small">
            <Modal.Body>
                <BodyLong>
                    {type === 'juridisk'
                        ? 'Er du sikker på at du vil endre til juridisk kontakt?'
                        : 'Er du sikker på at du vil fjerne denne kontakten?'}
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="danger" onClick={onConfirm}>
                    Ja, jeg er sikker
                </Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;
