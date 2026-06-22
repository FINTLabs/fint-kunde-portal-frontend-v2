import { afterEach, describe, expect, it } from 'vitest';

import { isClientSide, isServerSide } from './environment';

describe('environment', () => {
    afterEach(() => {
        if (!globalThis.window) {
            Object.defineProperty(globalThis, 'window', {
                configurable: true,
                value: {},
            });
        }
    });

    it('detects client side when window exists', () => {
        expect(isClientSide()).toBe(true);
        expect(isServerSide()).toBe(false);
    });

    it('detects server side when window is undefined', () => {
        Object.defineProperty(globalThis, 'window', {
            configurable: true,
            value: undefined,
        });

        expect(isClientSide()).toBe(false);
        expect(isServerSide()).toBe(true);
    });
});
