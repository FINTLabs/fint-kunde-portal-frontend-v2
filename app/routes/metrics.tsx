import { Counter, collectDefaultMetrics, Registry } from 'prom-client';

const register = new Registry();
collectDefaultMetrics({ register });

export const pageVisits = new Counter({
    name: 'app_page_visits_total',
    help: 'Total number of page visits per route',
    labelNames: ['path'],
});
register.registerMetric(pageVisits);

export async function loader() {
    return new Response(await register.metrics(), {
        headers: { 'Content-Type': register.contentType },
    });
}

export { register };
