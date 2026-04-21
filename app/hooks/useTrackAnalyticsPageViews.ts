import * as React from "react";
import { useLocation } from "react-router";
import AnalyticsApi from "~/api/AnalyticsApi";

export function useTrackAnalyticsPageViews(tenant?: string) {
    const location = useLocation();
    const lastSent = React.useRef<string | null>(null);

    React.useEffect(() => {
        const key = `${location.pathname}${location.search}`;

        if (lastSent.current === key) return;
        lastSent.current = key;

        void AnalyticsApi.trackEvent({
            type: "page_view",
            path: location.pathname,
            ...(tenant && { tenant }),
        });

        if (location.search) {
            const params = new URLSearchParams(location.search);
            const meta = Object.fromEntries(params.entries());

            void AnalyticsApi.trackSearch(location.pathname, meta, tenant);
        }
    }, [location.pathname, location.search, tenant]);
}