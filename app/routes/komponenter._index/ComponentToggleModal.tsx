import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Modal, TextField } from '@navikt/ds-react';
import React, { useState, useEffect } from 'react';

interface ComponentToggleModalProps {
    isOpen: boolean;
    componentName: string;
    isChecked: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ComponentToggleModal = ({
    isOpen,
    componentName,
    isChecked,
    onConfirm,
    onCancel,
}: ComponentToggleModalProps) => {
    const [typedName, setTypedName] = useState('');
    const isDeactivating = !isChecked;
    const canConfirm = isChecked || typedName === componentName;

    // Reset the typed name when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setTypedName('');
        }
    }, [isOpen]);

    return (
        <Modal
            open={isOpen}
            header={{
                heading: 'Bekreftelse',
                size: 'small',
                icon: <ExclamationmarkTriangleIcon />,
            }}
            width="small"
            onClose={onCancel}>
            <Modal.Body>
                <Heading size="small">
                    {isChecked
                        ? 'Er du sikker på at du vil aktivere denne komponenten?'
                        : 'Er du sikker på at du vil deaktivere denne komponenten?'}
                </Heading>
                <p>
                    Komponenten: <strong>{componentName}</strong>
                </p>
                {isDeactivating && (
                    <>
                        <p style={{ marginTop: '1rem' }}>
                            Skriv inn komponentnavnet for å bekrefte:
                        </p>
                        <TextField
                            label="Komponentnavn"
                            hideLabel
                            value={typedName}
                            onChange={(e) => setTypedName(e.target.value)}
                            placeholder={componentName}
                            size="small"
                            autoComplete="off"
                            data-cy="component-name-input"
                        />
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    data-cy="confirm-toggle-button"
                    type="button"
                    variant="primary"
                    onClick={onConfirm}
                    disabled={!canConfirm}
                    size={'small'}>
                    Ja, jeg er sikker
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    size={'small'}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ComponentToggleModal;

