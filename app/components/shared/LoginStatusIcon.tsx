import {
    CheckmarkCircleIcon,
    CircleSlashIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const CURRENT_TIME_MS = Date.now();
const ICON_COLORS = {
    success: 'var(--ax-bg-success-strong)',
    warning: 'var(--ax-bg-warning-strong)',
    info: 'var(--ax-bg-info-strong)',
    error: 'var(--ax-bg-danger-strong)',
} as const;

interface LoginStatusIconProps {
    lastLoginTime?: string | null;
    fontSize?: string;
}

export function LoginStatusIcon({
    lastLoginTime,
    fontSize = '1.5rem',
}: LoginStatusIconProps) {
    if (lastLoginTime === null || lastLoginTime === undefined) {
        return (
            <Tooltip content="Ingen innlogging registrert">
                <CircleSlashIcon fontSize={fontSize} color={ICON_COLORS.info} />
            </Tooltip>
        );
    }

    const parsedDate = new Date(lastLoginTime);
    if (Number.isNaN(parsedDate.getTime())) {
        return (
            <Tooltip content="Ugyldig innloggingstid">
                <CircleSlashIcon fontSize={fontSize} color={ICON_COLORS.info} />
            </Tooltip>
        );
    }

    const diffInDays = (CURRENT_TIME_MS - parsedDate.getTime()) / MILLISECONDS_PER_DAY;

    if (diffInDays > 30) {
        return (
            <Tooltip content="Sist innlogget for mer enn 30 dager siden">
                <XMarkOctagonIcon fontSize={fontSize} color={ICON_COLORS.error} />
            </Tooltip>
        );
    }

    return (
        <Tooltip content="Nylig innlogging">
            <CheckmarkCircleIcon fontSize={fontSize} color={ICON_COLORS.success} />
        </Tooltip>
    );
}
