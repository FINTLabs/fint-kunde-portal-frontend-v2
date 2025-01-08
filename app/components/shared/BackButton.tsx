import { Button } from '@navikt/ds-react';
import { useNavigate } from '@remix-run/react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';

export function BackButton({ to, className }: { to: string; className?: string }) {
    const navigate = useNavigate();

    return (
        <Button
            data-cy="back-button"
            className={className}
            icon={<ArrowLeftIcon title="Gå tilbake" fontSize="1.5rem" />}
            variant="tertiary"
            onClick={() => navigate(to)}></Button>
    );
}
