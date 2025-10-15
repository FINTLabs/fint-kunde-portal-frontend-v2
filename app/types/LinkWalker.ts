export type LinkWalkerStatus = 'FAILED' | 'SUCCESS' | 'PENDING' | 'RUNNING' | 'STARTED' | 'COMPLETED';

export type LinkWalkerEnvironment = 'api' | 'beta' | 'alpha' | 'pwf';

export interface ILinkWalkerTest {
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
    status: LinkWalkerStatus;
    org: string;
    errorMessage?: string;
}

