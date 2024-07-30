import { BodyLong, Button, Modal } from '@navikt/ds-react';
import { Form } from '@remix-run/react';
import { useRef } from 'react';
import { TrashIcon } from '@navikt/aksel-icons';

export function DeleteRessurs() {
    const ref = useRef<HTMLDialogElement>(null);
    return (
        <>
            <Button
                variant="danger"
                onClick={() => ref.current?.showModal()}
                icon={<TrashIcon aria-hidden />}>
                Slett
            </Button>
            <Modal ref={ref} header={{ heading: 'Slett ressurs' }}>
                <Modal.Body>
                    <BodyLong>Er du sikker på at du vil slette denne ressurs?</BodyLong>
                </Modal.Body>
                <Modal.Footer>
                    <Form action="delete" method="post" navigate={false}>
                        <Button type="submit" variant="danger">
                            Ja, jeg er sikker
                        </Button>
                    </Form>

                    <Button type="button" onClick={() => ref.current?.close()}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
