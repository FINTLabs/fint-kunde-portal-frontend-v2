// app/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { cleanup } from '@testing-library/react';
import { handlers } from '../../cypress/mocks/handlers';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { changeLanguage: () => Promise.resolve() },
    }),
}));

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
    cleanup();
    server.resetHandlers();
});
afterAll(() => server.close());
