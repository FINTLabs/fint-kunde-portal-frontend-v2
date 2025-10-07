import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useNavigate } from 'react-router';

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
