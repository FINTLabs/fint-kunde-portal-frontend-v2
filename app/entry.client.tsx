// entry.client.tsx
import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

async function enableMocking() {
    if (import.meta.env.DEV && import.meta.env.VITE_MOCK_CYPRESS === 'true') {
        const { worker } = await import('../cypress/mocks/browser');

        await worker.start({
            onUnhandledRequest: 'warn',
        });

        // optional, useful for debugging
        (window as Window & { __mswReady?: boolean }).__mswReady = true;
    }
}

async function main() {
    await enableMocking();

    startTransition(() => {
        hydrateRoot(
            document,
            <StrictMode>
                <HydratedRouter />
            </StrictMode>
        );
    });
}

void main();
