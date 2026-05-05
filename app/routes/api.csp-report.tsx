import type { ActionFunctionArgs } from 'react-router';

function asRecord(value: unknown): Record<string, unknown> | null {
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const contentType = request.headers.get('content-type') ?? 'unknown';
    const bodyText = await request.text();

    let reportPayload: unknown;
    try {
        reportPayload = JSON.parse(bodyText);
    } catch {
        reportPayload = { parseError: 'Invalid JSON body', raw: bodyText };
    }

    const payloadRecord = asRecord(reportPayload);
    const nestedReport = payloadRecord?.['csp-report'];
    const reportRecord = asRecord(nestedReport) ?? payloadRecord;

    console.log(
        '[CSP-REPORT]',
        JSON.stringify({
            contentType,
            documentUri: reportRecord?.['document-uri'] ?? null,
            violatedDirective: reportRecord?.['violated-directive'] ?? null,
            effectiveDirective: reportRecord?.['effective-directive'] ?? null,
            blockedUri: reportRecord?.['blocked-uri'] ?? null,
            disposition: reportRecord?.disposition ?? null,
            statusCode: reportRecord?.['status-code'] ?? null,
            sourceFile: reportRecord?.['source-file'] ?? null,
            lineNumber: reportRecord?.['line-number'] ?? null,
        })
    );

    return new Response(null, { status: 204 });
}
