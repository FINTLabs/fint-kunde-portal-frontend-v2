import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDeletedSearchParamAlert } from './useDeletedSearchParamAlert';

const { mockUseSearchParams, mockSetSearchParams } = vi.hoisted(() => ({
    mockUseSearchParams: vi.fn(),
    mockSetSearchParams: vi.fn(),
}));

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useSearchParams: () => mockUseSearchParams(),
    };
});

describe('useDeletedSearchParamAlert', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('adds success alert and clears deleted query param', () => {
        const searchParams = new URLSearchParams('deleted=test-client');
        mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);

        const setAlertState = vi.fn();
        renderHook(() =>
            useDeletedSearchParamAlert({
                label: 'Klient',
                setAlertState,
            })
        );

        expect(setAlertState).toHaveBeenCalledTimes(1);
        const updater = setAlertState.mock.calls[0][0] as (prev: unknown[]) => unknown[];
        expect(updater([])).toEqual([
            {
                id: 'delete-test-client',
                message: 'Klient «test-client» ble slettet.',
                status: 'success',
            },
        ]);

        expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
        const nextParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
        const options = mockSetSearchParams.mock.calls[0][1];
        expect(nextParams.get('deleted')).toBeNull();
        expect(options).toEqual({ replace: true });
    });

    it('does nothing when deleted query param is missing', () => {
        const searchParams = new URLSearchParams('page=1');
        mockUseSearchParams.mockReturnValue([searchParams, mockSetSearchParams]);

        const setAlertState = vi.fn();
        renderHook(() =>
            useDeletedSearchParamAlert({
                label: 'Klient',
                setAlertState,
            })
        );

        expect(setAlertState).not.toHaveBeenCalled();
        expect(mockSetSearchParams).not.toHaveBeenCalled();
    });
});
