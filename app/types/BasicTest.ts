export interface IResourceResult {
    resource: string;
    lastUpdated: number;
    size: number;
    status: 'OK' | 'FAILED';
    message: string;
}

export interface IHealthData {
    component: string;
    status: string;
    timestamp: number;
    time: string;
}

export interface IBasicTest {
    baseUrl: string;
    endpoint: string;
    clientName?: string;
}

export interface IBasicTestResponse {
    healthData: {
        healthData: IHealthData[];
    };
    cacheData: {
        resourceResults: IResourceResult[];
    };
}
