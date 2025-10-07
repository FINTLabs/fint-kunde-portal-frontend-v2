export const parseDate = (timeString: string): Date => {
    const [datePart, timePart] = timeString.split(' ');
    const [day, month] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    const date = new Date();
    date.setDate(day);
    date.setMonth(month - 1);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
};

export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const time = date.toLocaleTimeString('no-NO');
    return `${d}.${m}.${y} ${time}`;
};

export const formatTimeOnly = (timestamp: number): string => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString('no-NO');
    return `${time}`;
};
