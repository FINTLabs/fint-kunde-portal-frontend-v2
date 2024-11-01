export interface ILogResults {
    id: string;
    url: string;
    env: string;
    uri: string;
    client: string;
    requests: number;
    time: string;
    relationErrors: number;
    healthyRelations: number;
    totalRequests: number;
    status: string;
    org: string;
    errorMessage: string;
}
