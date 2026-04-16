// app/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { cleanup } from '@testing-library/react';
import { handlers } from '../../cypress/mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
    cleanup();
    server.resetHandlers();
});
afterAll(() => server.close());
