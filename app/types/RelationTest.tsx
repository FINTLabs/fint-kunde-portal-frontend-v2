export interface IRelationTest {
    id: string;
    url: string;
    env: string;
    uri: string;
    client: string;
    requests: number;
    time: string; // Consider changing to a Date type if this is a date-time value
    relationErrors: number;
    healthyRelations: number;
    totalRequests: number;
    status: string; // Could be further restricted to specific values like "STARTED", "STOPPED", etc.
    org: string;
}
