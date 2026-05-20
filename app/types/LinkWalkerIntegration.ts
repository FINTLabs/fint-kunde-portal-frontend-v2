export type ProblemType =
    | 'missing-resource'
    | 'unknown-link'
    | 'missing-back-link-adapter'
    | 'missing-back-link-autorelation';

export interface ComponentSummary {
    component: string;
    totalRecords: number;
    totalRefs: number;
    brokenLinkCount: number;
    integrityPercent: number | null;
    byProblemType: Record<string, number>;
    resources: ResourceSummary[];
}

export interface ResourceSummary {
    resource: string;
    totalRecords: number;
    totalRefs: number;
    brokenLinkCount: number;
    integrityPercent: number | null;
    byProblemType: Record<string, number>;
}

export interface ScanSummary {
    totalRecords: number;
    totalRefs: number;
    brokenLinkCount: number;
    integrityPercent: number | null;
    byProblemType: Record<string, number>;
    components: ComponentSummary[];
}

export interface LatestReportSummary {
    scanCompletedAt: string;
    orgId: string;
    components: string[];
    summary: ScanSummary;
}

export interface ReportRow {
    orgId: string;
    component: string;
    resource: string;
    problemType: ProblemType;
    sourceSelf: string;
    targetHref: string;
    relationName: string | null;
    expectedInverseName: string | null;
}

export interface PagedRows {
    rows: ReportRow[];
    page: number;
    size: number;
    totalRows: number;
    totalPages: number;
}

export interface GetRowsParams {
    orgId: string;
    component?: string;
    resource?: string;
    problemType?: string;
    page?: number;
    size?: number;
}

export interface LinkWalkerProblemTypeSummaryState {
    source: 'component' | 'resource';
    component: string;
    resource?: string;
    byProblemType: Record<string, number>;
}

export interface LinkWalkerBrokenNavigationState {
    problemTypeSummary?: LinkWalkerProblemTypeSummaryState;
}
