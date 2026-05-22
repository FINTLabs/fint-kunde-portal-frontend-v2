import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockAddAccess,
    mockUpdateEnvironments,
    mockAddComponentAccess,
    mockUpdateClient,
    mockDeleteClient,
    mockUpdateComponentInClient,
    mockSetPassword,
    mockGetOpenIdSecret,
    mockGetSelectedOrganization,
} = vi.hoisted(() => ({
    mockAddAccess: vi.fn(),
    mockUpdateEnvironments: vi.fn(),
    mockAddComponentAccess: vi.fn(),
    mockUpdateClient: vi.fn(),
    mockDeleteClient: vi.fn(),
    mockUpdateComponentInClient: vi.fn(),
    mockSetPassword: vi.fn(),
    mockGetOpenIdSecret: vi.fn(),
    mockGetSelectedOrganization: vi.fn(),
}));

vi.mock('~/api/AccessApi', () => ({
    default: {
        addAccess: mockAddAccess,
        updateEnvironments: mockUpdateEnvironments,
        addComponentAccess: mockAddComponentAccess,
    },
}));

vi.mock('~/api/ClientApi', () => ({
    default: {
        updateClient: mockUpdateClient,
        deleteClient: mockDeleteClient,
        updateComponentInClient: mockUpdateComponentInClient,
        setPassword: mockSetPassword,
        getOpenIdSecret: mockGetOpenIdSecret,
    },
}));

vi.mock('~/utils/selectedOrganization', () => ({
    getSelectedOrganization: mockGetSelectedOrganization,
}));

import { handleClientAction } from './actions';

describe('handleClientAction', () => {
    const clientName = 'client-a';
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

        return new Request('http://localhost/klienter/client-a', {
            method: 'POST',
            body: params,
        });
    }

    it('calls addAccess for ADD_ACCESS', async () => {
        const expected = { success: true };
        mockAddAccess.mockResolvedValue(expected);

        const result = await handleClientAction({
            request: createRequest({
                actionType: 'ADD_ACCESS',
                clientId: clientName,
                username: clientName,
            }),
        });

        expect(mockAddAccess).toHaveBeenCalledWith(clientName);
        expect(result).toEqual(expected);
    });

    it('calls updateEnvironments with all selected values', async () => {
        const expected = { success: true };
        mockUpdateEnvironments.mockResolvedValue(expected);

        const result = await handleClientAction({
            request: createRequest({
                actionType: 'UPDATE_ENVIRONMENT',
                username: clientName,
                'environments[]': ['api', 'beta'],
            }),
        });

        expect(mockUpdateEnvironments).toHaveBeenCalledWith(clientName, ['api', 'beta']);
        expect(result).toEqual(expected);
    });

    it('calls updateClient with form values', async () => {
        const expected = { success: true };
        mockUpdateClient.mockResolvedValue(expected);

        const result = await handleClientAction({
            request: createRequest({
                actionType: 'UPDATE_CLIENT',
                clientId: clientName,
                shortDescription: 'Kort beskrivelse',
                note: 'Notat',
                modelVersion: 'V4',
            }),
        });

        expect(mockUpdateClient).toHaveBeenCalledWith(
            clientName,
            'Kort beskrivelse',
            'Notat',
            'V4',
            selectedOrg
        );
        expect(result).toEqual(expected);
    });

    it('redirects after successful DELETE_CLIENT', async () => {
        mockDeleteClient.mockResolvedValue({ success: true });

        const result = await handleClientAction({
            request: createRequest({
                actionType: 'DELETE_CLIENT',
                clientId: clientName,
            }),
        });

        expect(mockDeleteClient).toHaveBeenCalledWith(clientName, selectedOrg);

        if (!(result instanceof Response)) {
            throw new Error('Expected redirect response');
        }

        expect(result.status).toBe(302);
        expect(result.headers.get('Location')).toBe(`/klienter?deleted=${clientName}`);
    });

    it('returns error payload when DELETE_CLIENT fails', async () => {
        mockDeleteClient.mockResolvedValue({ success: false });

        const result = await handleClientAction({
            request: createRequest({
                actionType: 'DELETE_CLIENT',
                clientId: clientName,
            }),
        });

        expect(result).toEqual({
            success: false,
            status: 500,
            message: `Kunne ikke slette klient '${clientName}'`,
            variant: 'error',
        });
    });

    it('calls updateComponentInClient for ADD_COMPONENT_ACCESS', async () => {
        const expected = { success: true };
        mockUpdateComponentInClient.mockResolvedValue(expected);

        const result = await handleClientAction({
            request: createRequest({
                actionType: 'ADD_COMPONENT_ACCESS',
                username: clientName,
                componentName: 'utdanning-larling',
                enabled: 'true',
            }),
        });

        expect(mockUpdateComponentInClient).toHaveBeenCalledWith(
            'utdanning-larling',
            clientName,
            selectedOrg,
            'true'
        );
        expect(result).toEqual(expected);
    });

    it('calls addComponentAccess for ADD_COMPONENT_ACCESS_NEW', async () => {
        const expected = { success: true };
        mockAddComponentAccess.mockResolvedValue(expected);

        const result = await handleClientAction({
            request: createRequest({
                actionType: 'ADD_COMPONENT_ACCESS_NEW',
                username: clientName,
                componentName: 'utdanning-larling',
                enabled: 'false',
            }),
        });

        expect(mockAddComponentAccess).toHaveBeenCalledWith(
            clientName,
            'utdanning-larling',
            'false'
        );
        expect(result).toEqual(expected);
    });

    it('calls setPassword with entityName and password', async () => {
        const expected = { success: true };
        mockSetPassword.mockResolvedValue(expected);

        const result = await handleClientAction({
            request: createRequest({
                actionType: 'UPDATE_PASSWORD',
                entityName: 'client-a',
                password: 'secret',
            }),
        });

        expect(mockSetPassword).toHaveBeenCalledWith('client-a', 'secret', selectedOrg);
        expect(result).toEqual(expected);
    });

    it('returns clientSecret payload for GET_SECRET', async () => {
        mockGetOpenIdSecret.mockResolvedValue({ status: 200, data: 'open-id-secret' });

        const result = await handleClientAction({
            request: createRequest({
                actionType: 'GET_SECRET',
                entityName: 'client-a',
            }),
        });

        expect(mockGetOpenIdSecret).toHaveBeenCalledWith('client-a', selectedOrg);
        expect(result).toEqual({
            success: true,
            clientSecret: 'open-id-secret',
            message: 'Klienthemmeligheten ble hentet',
            variant: 'success',
        });
    });

    it('returns error payload when GET_SECRET fails', async () => {
        mockGetOpenIdSecret.mockResolvedValue({ status: 500, data: null });

        const result = await handleClientAction({
            request: createRequest({
                actionType: 'GET_SECRET',
                entityName: 'client-a',
            }),
        });

        expect(result).toEqual({
            success: false,
            status: 500,
            message: 'Kunne ikke hente klienthemmeligheten',
            variant: 'error',
        });
    });

    it('returns an error payload for unknown actionType', async () => {
        const result = await handleClientAction({
            request: createRequest({
                actionType: 'SOMETHING_ELSE',
            }),
        });

        expect(result).toEqual({
            success: false,
            status: 400,
            message: "Ukjent handlingstype: 'SOMETHING_ELSE'",
            variant: 'error',
        });
    });
});
