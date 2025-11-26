import { Counter, collectDefaultMetrics, Registry } from 'prom-client';

const register = new Registry();
collectDefaultMetrics({ register });

export const pageVisits = new Counter({
    name: 'app_page_visits_total',
    help: 'Total number of page visits per route',
    labelNames: ['path'],
});
register.registerMetric(pageVisits);

export const dailyPageVisits = new Counter({
    name: 'app_page_visits_daily',
    help: 'Daily number of page visits per route (resets each day)',
    labelNames: ['path', 'date'],
});
register.registerMetric(dailyPageVisits);

/**
 * Get the current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
}

export async function loader() {
    return new Response(await register.metrics(), {
        headers: { 'Content-Type': register.contentType },
    });
}

export { register };
