import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { ServerRouter } from 'react-router';
import type { EntryContext } from 'react-router';
import type { AppLoadContext } from 'react-router';

let mswStarted = false;

async function startMockServer() {
    if (!import.meta.env.DEV || process.env.VITE_MOCK_CYPRESS !== 'true') {
        return;
    }

    if (mswStarted) return;

    const { server } = await import('../cypress/mocks/node');
    server.listen({
        onUnhandledRequest: 'warn',
    });

    mswStarted = true;
    console.log('MSW node server started');
}

await startMockServer();

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
    _loadContext: AppLoadContext
) {
    return await new Promise<Response>((resolve, reject) => {
        let shellRendered = false;

        const { pipe, abort } = renderToPipeableStream(
            <ServerRouter context={routerContext} url={request.url} />,
            {
                onShellReady() {
                    shellRendered = true;

                    const body = new PassThrough();
                    responseHeaders.set('Content-Type', 'text/html');

                    resolve(
                        new Response(body as unknown as ReadableStream, {
                            headers: responseHeaders,
                            status: responseStatusCode,
                        })
                    );

                    pipe(body);
                },
                onShellError(error) {
                    reject(error);
                },
                onError(error) {
                    responseStatusCode = 500;
                    if (shellRendered) {
                        console.error(error);
                    }
                },
            }
        );

        setTimeout(abort, 5000);
    });
}
