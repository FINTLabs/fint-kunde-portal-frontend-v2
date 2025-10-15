export interface ReduntantLogEvent {
    corrId: string;
    action: string;
    status: string;
    time: number;
    orgId: string;
    source: string;
    client: string;
    data: string[];
    message: string | null;
    statusCode: string | null;
    responseStatus: string | null;
}

export interface ReduntantLog {
    corrId: string;
    source: string;
    orgId: string;
    timestamp: number;
    event: ReduntantLogEvent;
    clearData: boolean;
}

// Type alias for the backend AuditEvent (same as ReduntantLog)
export type AuditEvent = ReduntantLog;

export interface LogEvent {
    timestamp: number;
    klient: string;
    status: string;
    response: string;
    melding: string;
}
// Mapped log
export interface Log {
    id: string;
    timestamp: number;
    action: string;
    events: LogEvent[];
}
