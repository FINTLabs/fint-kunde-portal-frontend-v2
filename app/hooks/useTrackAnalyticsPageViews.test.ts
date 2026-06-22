import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useTrackAnalyticsPageViews } from './useTrackAnalyticsPageViews';

const { mockUseLocation, mockUseMatches, mockTrackEvent, mockTrackSearch } = vi.hoisted(() => ({
    mockUseLocation: vi.fn(),
    mockUseMatches: vi.fn(),
    mockTrackEvent: vi.fn(),
    mockTrackSearch: vi.fn(),
}));

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useLocation: () => mockUseLocation(),
        useMatches: () => mockUseMatches(),
    };
});

vi.mock('~/api/AnalyticsApi', () => ({
    default: {
        trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
        trackSearch: (...args: unknown[]) => mockTrackSearch(...args),
    },
}));

describe('useTrackAnalyticsPageViews', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('tracks page view with route analytics metadata and query params', () => {
        mockUseLocation.mockReturnValue({
            pathname: '/adapter/adapter@fint.no',
            search: '?query=test&page=2',
        });
        mockUseMatches.mockReturnValue([
            {
                params: { id: 'adapter@fint.no' },
                handle: {
                    analytics: {
                        pageType: 'adapter',
                        pathPattern: '/adapter/:id',
                    },
                },
            },
        ]);

        renderHook(() => useTrackAnalyticsPageViews('fint-org'));

        expect(mockTrackEvent).toHaveBeenCalledWith({
            type: 'page_view',
            path: '/adapter/:id',
            tenant: 'fint-org',
            meta: {
                params: { id: 'adapter@fint.no' },
                rawPath: '/adapter/adapter@fint.no',
            },
        });
        expect(mockTrackSearch).toHaveBeenCalledWith(
            '/adapter/:id',
            { query: 'test', page: '2' },
            'fint-org'
        );
    });

    it('falls back to location pathname and does not send search event when query is empty', () => {
        mockUseLocation.mockReturnValue({
            pathname: '/komponenter',
            search: '',
        });
        mockUseMatches.mockReturnValue([
            {
                params: {},
                handle: {},
            },
        ]);

        renderHook(() => useTrackAnalyticsPageViews());

        expect(mockTrackEvent).toHaveBeenCalledWith({
            type: 'page_view',
            path: '/komponenter',
        });
        expect(mockTrackSearch).not.toHaveBeenCalled();
    });

    it('deduplicates tracking for identical path and search across rerenders', () => {
        mockUseLocation.mockReturnValue({
            pathname: '/clients',
            search: '?q=abc',
        });
        mockUseMatches.mockReturnValue([
            {
                params: {},
                handle: {
                    analytics: {
                        pathPattern: '/clients',
                    },
                },
            },
        ]);

        const { rerender } = renderHook(() => useTrackAnalyticsPageViews('tenant-1'));
        rerender();

        expect(mockTrackEvent).toHaveBeenCalledTimes(1);
        expect(mockTrackSearch).toHaveBeenCalledTimes(1);
    });
});
