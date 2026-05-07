import * as React from 'react';
import { useLocation, useMatches } from 'react-router';
import AnalyticsApi from '~/api/AnalyticsApi';

type AnalyticsHandle = {
    analytics?: {
        pageType?: string;
        pathPattern?: string;
    };
};

export function useTrackAnalyticsPageViews(tenant?: string) {
    const location = useLocation();
    const matches = useMatches();

    const leafMatch = matches[matches.length - 1] as
        | ((typeof matches)[number] & { handle?: AnalyticsHandle })
        | undefined;

    const analytics = leafMatch?.handle?.analytics;
    const trackedPath = analytics?.pathPattern ?? location.pathname;
    const params = React.useMemo(() => leafMatch?.params ?? {}, [leafMatch?.params]);
    const hasParams = React.useMemo(() => Object.keys(params).length > 0, [params]);

    const lastSent = React.useRef<string | null>(null);

    React.useEffect(() => {
        const key = `${trackedPath}${location.search}`;

        if (lastSent.current === key) return;
        lastSent.current = key;

        void AnalyticsApi.trackEvent({
            type: 'page_view',
            path: trackedPath,
            ...(tenant && { tenant }),
            ...(hasParams && {
                meta: {
                    params,
                    rawPath: location.pathname,
                },
            }),
        });

        if (location.search) {
            const meta = Object.fromEntries(new URLSearchParams(location.search).entries());

            void AnalyticsApi.trackSearch(trackedPath, meta, tenant);
        }
    }, [
        location.pathname,
        location.search,
        trackedPath,
        tenant,
        leafMatch?.params,
        hasParams,
        params,
    ]);
}
