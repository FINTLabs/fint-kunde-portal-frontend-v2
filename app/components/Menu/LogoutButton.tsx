import { LeaveIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Modal } from '@navikt/ds-react';
import { useNavigate } from '@remix-run/react';
import { useRef } from 'react';

export function LogoutButton() {
    const ref = useRef<HTMLDialogElement>(null);
    const navigate = useNavigate();

    return (
        <>
            <Button
                variant="tertiary"
                title="logg ut"
                icon={<LeaveIcon title="logg ut" fontSize="1.5rem" />}
                onClick={() => ref.current?.showModal()}></Button>
            <Modal ref={ref} header={{ heading: 'Logg ut' }}>
                <Modal.Body>
                    <BodyLong>Er du sikker på at du vil logge ut?</BodyLong>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" onClick={() => ref.current?.close()}>
                        Nei
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            navigate('/logout');
                        }}>
                        Ja
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
