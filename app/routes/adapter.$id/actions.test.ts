import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockAddComponentAccess,
    mockAddAccess,
    mockUpdateEnvironments,
    mockDeleteAccess,
    mockSetPassword,
    mockGetOpenIdSecret,
    mockUpdateAdapter,
    mockUpdateComponentInAdapter,
    mockDeleteAdapter,
    mockGetSelectedOrganization,
} = vi.hoisted(() => {
    return {
        mockAddComponentAccess: vi.fn(),
        mockAddAccess: vi.fn(),
        mockUpdateEnvironments: vi.fn(),
        mockDeleteAccess: vi.fn(),
        mockSetPassword: vi.fn(),
        mockGetOpenIdSecret: vi.fn(),
        mockUpdateAdapter: vi.fn(),
        mockUpdateComponentInAdapter: vi.fn(),
        mockDeleteAdapter: vi.fn(),
        mockGetSelectedOrganization: vi.fn(),
    };
});

vi.mock('~/api/AccessApi', () => ({
    default: {
        addComponentAccess: mockAddComponentAccess,
        addAccess: mockAddAccess,
        updateEnvironments: mockUpdateEnvironments,
        deleteAccess: mockDeleteAccess,
    },
}));

vi.mock('~/api/AdapterApi', () => ({
    default: {
        setPassword: mockSetPassword,
        getOpenIdSecret: mockGetOpenIdSecret,
        updateAdapter: mockUpdateAdapter,
        updateComponentInAdapter: mockUpdateComponentInAdapter,
        deleteAdapter: mockDeleteAdapter,
    },
}));

vi.mock('~/utils/selectedOrganization', () => ({
    getSelectedOrganization: mockGetSelectedOrganization,
}));

import { handleAdapterAction } from './actions';

describe('handleAdapterAction', () => {
    const adapterName = 'adapter-a';
    const selectedOrg = 'fint-org';

    beforeEach(() => {
        vi.clearAllMocks();
        mockGetSelectedOrganization.mockResolvedValue(selectedOrg);
    });

    function createRequest(formData: Record<string, string | string[]>): Request {
        const params = new URLSearchParams();
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item) => params.append(key, item));
                return;
            }

            params.append(key, value);
        });

        return new Request('http://localhost/adapter/action', {
            method: 'POST',
            body: params,
        });
    }

    it('calls addComponentAccess for ADD_COMPONENT_ACCESS', async () => {
        const expected = { success: true };
        mockAddComponentAccess.mockResolvedValue(expected);
        const request = createRequest({
            actionType: 'ADD_COMPONENT_ACCESS',
            componentName: 'component-a',
            enabled: 'true',
        });

        const result = await handleAdapterAction({
            request,
            params: { name: adapterName },
        });

        expect(mockAddComponentAccess).toHaveBeenCalledWith(adapterName, 'component-a', 'true');
        expect(result).toEqual(expected);
    });

    it('calls addAccess for ADD_ACCESS', async () => {
        const expected = { success: true };
        mockAddAccess.mockResolvedValue(expected);
        const request = createRequest({
            actionType: 'ADD_ACCESS',
        });

        const result = await handleAdapterAction({
            request,
            params: { name: adapterName },
        });

        expect(mockAddAccess).toHaveBeenCalledWith(adapterName);
        expect(result).toEqual(expected);
    });

    it('calls updateEnvironments with all selected values', async () => {
        const expected = { success: true };
        mockUpdateEnvironments.mockResolvedValue(expected);
        const request = createRequest({
            actionType: 'UPDATE_ENVIRONMENT',
            'environments[]': ['dev', 'prod'],
        });

        const result = await handleAdapterAction({
            request,
            params: { name: adapterName },
        });

        expect(mockUpdateEnvironments).toHaveBeenCalledWith(adapterName, ['dev', 'prod']);
        expect(result).toEqual(expected);
    });

    it('calls setPassword with entityName and password', async () => {
        const expected = { success: true };
        mockSetPassword.mockResolvedValue(expected);
        const request = createRequest({
            actionType: 'UPDATE_PASSWORD',
            entityName: 'adapter-client',
            password: 'secret',
        });

        const result = await handleAdapterAction({
            request,
            params: { name: adapterName },
        });

        expect(mockSetPassword).toHaveBeenCalledWith('adapter-client', 'secret', selectedOrg);
        expect(result).toEqual(expected);
    });

    it('returns clientSecret payload for GET_SECRET', async () => {
        mockGetOpenIdSecret.mockResolvedValue({ data: 'open-id-secret' });
        const request = createRequest({
            actionType: 'GET_SECRET',
            entityName: 'adapter-client',
        });

        const result = await handleAdapterAction({
            request,
            params: { name: adapterName },
        });

        expect(mockGetOpenIdSecret).toHaveBeenCalledWith('adapter-client', selectedOrg);
        expect(result).toEqual({
            clientSecret: 'open-id-secret',
            message: 'Adapterhemmelighet ble hentet',
            variant: 'success',
        });
    });

    it('calls updateAdapter with form values', async () => {
        const expected = { success: true };
        mockUpdateAdapter.mockResolvedValue(expected);
        const request = createRequest({
            actionType: 'UPDATE_ADAPTER',
            shortDescription: 'Kort beskrivelse',
            note: 'Notat',
        });

        const result = await handleAdapterAction({
            request,
            params: { name: adapterName },
        });

        expect(mockUpdateAdapter).toHaveBeenCalledWith(
            {
                name: adapterName,
                shortDescription: 'Kort beskrivelse',
                note: 'Notat',
            },
            selectedOrg
        );
        expect(result).toEqual(expected);
    });

    it('calls updateComponentInAdapter with checkbox state', async () => {
        const expected = { success: true };
        mockUpdateComponentInAdapter.mockResolvedValue(expected);
        const request = createRequest({
            actionType: 'UPDATE_COMPONENT_IN_ADAPTER',
            componentName: 'component-a',
            adapterName: adapterName,
            isChecked: 'false',
        });

        const result = await handleAdapterAction({
            request,
            params: { name: adapterName },
        });

        expect(mockUpdateComponentInAdapter).toHaveBeenCalledWith(
            'component-a',
            adapterName,
            selectedOrg,
            'false'
        );
        expect(result).toEqual(expected);
    });

    it('deletes adapter and access, then redirects for DELETE_ADAPTER', async () => {
        const request = createRequest({
            actionType: 'DELETE_ADAPTER',
        });

        const result = await handleAdapterAction({
            request,
            params: { name: adapterName },
        });

        expect(mockDeleteAdapter).toHaveBeenCalledWith(adapterName, selectedOrg);
        expect(mockDeleteAccess).toHaveBeenCalledWith(adapterName);

        if (!(result instanceof Response)) {
            throw new Error('Expected redirect response');
        }

        expect(result.status).toBe(302);
        expect(result.headers.get('Location')).toBe(`/adaptere?deleted=${adapterName}`);
    });

    it('returns an error payload for unknown actionType', async () => {
        const request = createRequest({
            actionType: 'SOMETHING_ELSE',
        });

        const result = await handleAdapterAction({
            request,
            params: { name: adapterName },
        });

        expect(result).toEqual({
            success: false,
            message: "Ukjent handlingstype: 'SOMETHING_ELSE'",
            variant: 'error',
        });
    });
});
