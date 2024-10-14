export interface IBasicTestResult {
    status: string;
    resource: string;
    component: string;
    lastUpdated: string;
    size: string;
    message: string;
}

export interface IBasicTest {
    baseUrl: string;
    endpoint: string;
    clientName: string;
}