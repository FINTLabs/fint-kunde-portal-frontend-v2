import { Button } from '@navikt/ds-react';
import { useNavigate } from '@remix-run/react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';

export function BackButton({ to }: { to: string }) {
    const navigate = useNavigate();

    return (
        <Button
            icon={<ArrowLeftIcon title="Gå tilbake" fontSize="1.5rem" />}
            variant="tertiary"
            onClick={() => navigate(to)}></Button>
    );
}
