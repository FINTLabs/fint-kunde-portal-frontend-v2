import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Modal, TextField } from '@navikt/ds-react';
import React, { useState } from 'react';

interface ComponentToggleModalProps {
    isOpen: boolean;
    componentName: string;
    isChecked: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ComponentToggleModalContent = ({
    componentName,
    isChecked,
    onConfirm,
    onCancel,
}: Omit<ComponentToggleModalProps, 'isOpen'>) => {
    const [typedName, setTypedName] = useState('');
    const isDeactivating = !isChecked;
    const canConfirm = isChecked || typedName === componentName;

    return (
        <>
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
                        <p className="component-toggle-modal-confirm-text">
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
                    size="small">
                    Ja, jeg er sikker
                </Button>

                <Button type="button" variant="secondary" onClick={onCancel} size="small">
                    Avbryt
                </Button>
            </Modal.Footer>
        </>
    );
};

const ComponentToggleModal = ({
    isOpen,
    componentName,
    isChecked,
    onConfirm,
    onCancel,
}: ComponentToggleModalProps) => {
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
            {isOpen && (
                <ComponentToggleModalContent
                    key={`${componentName}-${isChecked}`}
                    componentName={componentName}
                    isChecked={isChecked}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                />
            )}
        </Modal>
    );
};

export default ComponentToggleModal;
