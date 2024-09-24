import { BodyLong, Button, Modal } from '@navikt/ds-react';
import { Form } from '@remix-run/react';
import { useRef } from 'react';
import { TrashIcon } from '@navikt/aksel-icons';

type DeleteModalProps = {
    title: string;
    bodyText: string;
    action: string;
};

export function DeleteModal({ title, bodyText, action }: DeleteModalProps) {
    const ref = useRef<HTMLDialogElement>(null);
    return (
        <>
            <Button
                // variant="danger"
                onClick={() => ref.current?.showModal()}
                icon={<TrashIcon aria-hidden />}
                size={'xsmall'}>
                {title}
            </Button>
            <Modal ref={ref} header={{ heading: title }}>
                <Modal.Body>
                    <BodyLong>{bodyText}</BodyLong>
                </Modal.Body>
                <Modal.Footer>
                    <Form action={action} method="post" navigate={false}>
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
