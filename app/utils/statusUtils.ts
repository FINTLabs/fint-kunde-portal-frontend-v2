/**
 * Formats a timestamp to a readable date string
 */
export function formatDate(timestamp: number): string {
    if (timestamp <= 0) {
        return 'Never';
    }

    const date = new Date(timestamp);
    return date.toLocaleDateString('no-NO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatComponents(compontents: string[]): Array<string> {
    const resources = new Array<string>();
    compontents.forEach((component: string) => {
        const parts = component.split('.');
        if (parts.length > 1) {
            if (!resources.find((resource) => resource === parts[0])) {
                resources.push(parts[0]);
            }
        }
    });

    return resources;
}
/**
 * Calculates the time difference between a given timestamp and now
 * Returns a human-readable string like "2 hours ago", "3 days ago", etc.
 */
export function timeSince(
    timestamp: number | undefined,
    compareTo: number = new Date().getTime()
): string {
    if (timestamp === undefined) return 'Ukjent tidspunkt';
    const createdTimeStamp = new Date(timestamp);

    const elapsedMs = compareTo - createdTimeStamp.getTime();
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    if (timestamp && compareTo !== new Date().getTime()) {
        const remainingHours = elapsedHours % 24;
        const remainingMinutes = elapsedMinutes % 60;
        const remainingSeconds = elapsedSeconds % 60;
        if (elapsedDays > 365) {
            return '> 1 år';
        } else if (elapsedDays > 0) {
            return `${elapsedDays} d, ${remainingHours} t, ${remainingMinutes} m og ${remainingSeconds} s`;
        } else if (elapsedHours > 0) {
            return `${elapsedHours} t, ${remainingMinutes} m og ${remainingSeconds} s`;
        } else if (elapsedMinutes > 0) {
            return `${elapsedMinutes} m og ${remainingSeconds} s`;
        } else {
            return `${elapsedSeconds} s`;
        }
    } else {
        const remainingHours = elapsedHours % 24;
        const remainingMinutes = elapsedMinutes % 60;
        if (elapsedDays > 365) {
            return '> 1 år';
        } else if (elapsedDays > 0) {
            return `${elapsedDays} d ${remainingHours} t`;
        } else if (elapsedHours > 0) {
            return `${remainingHours} t ${remainingMinutes} m`;
        } else {
            return `${remainingMinutes} m`;
        }
    }
}

export function convertTimeStamp(timestamp: number | undefined): string {
    if (timestamp === undefined) return 'Ukjent tidspunkt';
    const date = new Date(timestamp);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}
