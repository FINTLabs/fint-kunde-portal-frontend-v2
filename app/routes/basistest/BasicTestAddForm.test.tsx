import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BasicTestAddForm from './BasicTestAddForm';
import { IClient, IComponent } from '~/types';

function makeClient(overrides: Partial<IClient> = {}): IClient {
    return {
        ...(overrides as Partial<IClient>),

        // IPartialClient fields
        name: overrides.name ?? 'client-1',
        shortDescription: overrides.shortDescription ?? 'Client 1',
        note: overrides.note ?? '',

        // IClient fields
        dn: overrides.dn ?? 'dn-client-1',
        assetId: overrides.assetId ?? [],
        asset: overrides.asset ?? '',
        clientId: overrides.clientId ?? 'clientId-1',
        components: overrides.components ?? [],
        accessPackages: overrides.accessPackages ?? [],
        managed: overrides.managed ?? false,

        // optional
        modelVersion: overrides.modelVersion,
        lastLoginTime: overrides.lastLoginTime,
    };
}
function makeComponent(overrides: Partial<IComponent> = {}): IComponent {
    return {
        ...(overrides as Partial<IComponent>),

        dn: overrides.dn ?? 'dn-comp-1',
        name: overrides.name ?? 'component-1',
        description: overrides.description ?? 'Component 1',
        organisations: overrides.organisations ?? [],
        clients: overrides.clients ?? [],
        adapters: overrides.adapters ?? [],
        basePath: overrides.basePath ?? '/comp-1',
        port: overrides.port ?? null,
        core: overrides.core ?? false,
        openData: overrides.openData ?? false,
        common: overrides.common ?? false,
        cacheDisabledFor: overrides.cacheDisabledFor ?? [],
        inProduction: overrides.inProduction ?? false,
        inBeta: overrides.inBeta ?? false,
        inPlayWithFint: overrides.inPlayWithFint ?? true,

        // optional fields from IComponent
        dockerImage: overrides.dockerImage ?? null,
        componentSizes: overrides.componentSizes ?? null,
    };
}

describe('BasicTestAddForm', () => {
    it('shows validation errors when required fields are missing', async () => {
        const user = userEvent.setup();
        render(
            <BasicTestAddForm
                components={[makeComponent()]}
                clients={[makeClient()]}
                onSearchSubmit={vi.fn()}
            />
        );

        await user.click(screen.getByRole('button', { name: /kjør/i }));

        expect(screen.getByText('Miljø er påkrevd')).toBeInTheDocument();
        expect(screen.getByText('Komponent er påkrevd')).toBeInTheDocument();
        expect(screen.getByText('Klient er påkrevd')).toBeInTheDocument();
    });

    it('requires client when environment is not play-with-fint', async () => {
        const user = userEvent.setup();
        const onSearchSubmit = vi.fn();

        render(
            <BasicTestAddForm
                components={[makeComponent()]}
                clients={[makeClient()]}
                onSearchSubmit={onSearchSubmit}
            />
        );

        await user.selectOptions(screen.getByLabelText('Miljø'), 'https://beta.felleskomponent.no');
        await user.selectOptions(screen.getByLabelText('Komponent'), '/comp-1');

        await user.click(screen.getByRole('button', { name: /kjør/i }));

        expect(screen.getByText('Klient er påkrevd')).toBeInTheDocument();
        expect(onSearchSubmit).not.toHaveBeenCalled();
    });

    it('does NOT require client for play-with-fint and submits with empty clientName', async () => {
        const user = userEvent.setup();
        const onSearchSubmit = vi.fn();

        render(
            <BasicTestAddForm
                components={[makeComponent()]}
                clients={[makeClient({ name: 'c1', shortDescription: 'A', managed: false })]}
                onSearchSubmit={onSearchSubmit}
            />
        );

        await user.selectOptions(
            screen.getByLabelText('Miljø'),
            'https://play-with-fint.felleskomponent.no'
        );
        await user.selectOptions(screen.getByLabelText('Komponent'), '/comp-1');

        await user.click(screen.getByRole('button', { name: /kjør/i }));

        expect(onSearchSubmit).toHaveBeenCalledWith(
            'https://play-with-fint.felleskomponent.no',
            '/comp-1',
            ''
        );
    });

    it('filters out managed clients from the client select options', () => {
        render(
            <BasicTestAddForm
                components={[makeComponent()]}
                clients={[
                    makeClient({ dn: 'dn-a', name: 'a', shortDescription: 'A', managed: false }),
                    makeClient({ dn: 'dn-b', name: 'b', shortDescription: 'B', managed: true }),
                ]}
                onSearchSubmit={vi.fn()}
            />
        );

        const clientSelect = screen.getByLabelText('Klient');
        expect(clientSelect).toHaveTextContent('Velg');
        expect(clientSelect).toHaveTextContent('A');
        expect(clientSelect).not.toHaveTextContent('B');
    });

    it('submits selected values when valid (non play-with-fint)', async () => {
        const user = userEvent.setup();
        const onSearchSubmit = vi.fn();

        render(
            <BasicTestAddForm
                components={[makeComponent({ basePath: '/comp-x', description: 'Comp X' })]}
                clients={[
                    makeClient({ dn: 'dn-x', name: 'client-x', shortDescription: 'Client X' }),
                ]}
                onSearchSubmit={onSearchSubmit}
            />
        );

        await user.selectOptions(screen.getByLabelText('Miljø'), 'https://api.felleskomponent.no');
        await user.selectOptions(screen.getByLabelText('Komponent'), '/comp-x');
        await user.selectOptions(screen.getByLabelText('Klient'), 'client-x');

        await user.click(screen.getByRole('button', { name: /kjør/i }));

        expect(onSearchSubmit).toHaveBeenCalledWith(
            'https://api.felleskomponent.no',
            '/comp-x',
            'client-x'
        );
    });
});
