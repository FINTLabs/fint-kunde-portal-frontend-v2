import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HeaderProperties } from '~/utils/headerProperties';

const { mockCall } = vi.hoisted(() => {
    return {
        mockCall: vi.fn(),
    };
});

vi.mock('novari-frontend-components', () => {
    class MockNovariApiManager {
        call = mockCall;
    }

    return {
        NovariApiManager: MockNovariApiManager,
    };
});

vi.mock('~/utils/headerProperties', () => ({
    HeaderProperties: {
        getXnin: vi.fn(),
    },
}));

import ComponentApi from './ComponentApi';

describe('ComponentApi', () => {
    const organisationName = 'fint-org';
    const componentName = 'component-a';

    beforeEach(() => {
        mockCall.mockReset();
        vi.mocked(HeaderProperties.getXnin).mockReturnValue('12345678901');
        mockCall.mockResolvedValue({ success: true, data: [] });
    });

    it('getAllComponents calls expected endpoint with headers', async () => {
        await ComponentApi.getAllComponents();

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: '/api/components',
            functionName: 'getAllComponents',
            customErrorMessage: 'Kunne ikke hente alle komponenter.',
            customSuccessMessage: 'Komponenter hentet.',
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });

    it('getComponentById returns matching component when found', async () => {
        const matchingComponent = { name: componentName };
        const getAllComponentsSpy = vi.spyOn(ComponentApi, 'getAllComponents').mockResolvedValue({
            success: true,
            data: [{ name: 'other' }, matchingComponent],
        } as any);

        const result = await ComponentApi.getComponentById(componentName);

        expect(getAllComponentsSpy).toHaveBeenCalled();
        expect(result).toEqual(matchingComponent);

        getAllComponentsSpy.mockRestore();
    });

    it('getComponentById returns null when no matching component exists', async () => {
        const getAllComponentsSpy = vi
            .spyOn(ComponentApi, 'getAllComponents')
            .mockResolvedValue({ success: true, data: [{ name: 'other' }] } as any);

        const result = await ComponentApi.getComponentById(componentName);

        expect(getAllComponentsSpy).toHaveBeenCalled();
        expect(result).toBeNull();

        getAllComponentsSpy.mockRestore();
    });

    it('getOrganisationComponents calls expected endpoint with headers', async () => {
        await ComponentApi.getOrganisationComponents(organisationName);

        expect(mockCall).toHaveBeenCalledWith({
            method: 'GET',
            endpoint: `/api/components/organisation/${organisationName}`,
            functionName: 'getOrganisationComponents',
            customErrorMessage: `Kunne ikke hente komponenter for organisasjonen: ${organisationName}.`,
            customSuccessMessage: `Komponenter for organisasjonen ${organisationName} ble hentet.`,
            additionalHeaders: {
                'x-nin': '12345678901',
            },
        });
    });
});
