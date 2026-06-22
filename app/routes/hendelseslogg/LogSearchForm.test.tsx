import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import LogSearchForm from './LogSearchForm';
import type { IComponent } from '~/types/Component';
import type { IComponentConfig } from '~/types/ComponentConfig';

describe('LogSearchForm', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    function makeComponent(overrides: Partial<IComponent> = {}): IComponent {
        return {
            ...(overrides as Partial<IComponent>),
            dn: overrides.dn ?? 'dn-comp-1',
            name: overrides.name ?? 'comp-1',
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
            dockerImage: overrides.dockerImage ?? null,
            componentSizes: overrides.componentSizes ?? null,
        };
    }

    function makeConfig(overrides: Partial<IComponentConfig> = {}): IComponentConfig {
        return {
            ...(overrides as Partial<IComponentConfig>),
            dn: overrides.dn ?? 'dn=comp-1,ou=configs',
            name: overrides.name ?? 'config-1',
            displayName: overrides.displayName ?? 'Config 1',
            path: overrides.path ?? '/config-1',
            assetPath: overrides.assetPath ?? '/asset-1',
            classes: overrides.classes ?? [
                {
                    name: 'Student',
                    path: '/student',
                },
                {
                    name: 'Employee',
                    path: '/employee',
                },
            ],
            core: overrides.core ?? false,
            inProduction: overrides.inProduction ?? false,
            inBeta: overrides.inBeta ?? false,
            inPlayWithFint: overrides.inPlayWithFint ?? true,
        };
    }

    it('shows validation errors and does not submit when required fields are missing', () => {
        const onSearchSubmit = vi.fn();

        render(
            <LogSearchForm
                onSearchSubmit={onSearchSubmit}
                components={[makeComponent()]}
                configs={[makeConfig()]}
                onFilter={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /søk/i }));

        expect(screen.getAllByText('Påkrevd').length).toBeGreaterThan(0);
        expect(onSearchSubmit).not.toHaveBeenCalled();
    });

    it('filters matching configs based on selected component dn includes component value', () => {
        render(
            <LogSearchForm
                onSearchSubmit={vi.fn()}
                components={[makeComponent({ name: 'comp-1', description: 'Component 1' })]}
                configs={[
                    makeConfig({
                        dn: 'something comp-1 something',
                        classes: [{ name: 'Student', path: '/student' }],
                    }),
                    makeConfig({ dn: 'other-dn', classes: [{ name: 'Employee', path: '/employee' }] }),
                ]}
                onFilter={vi.fn()}
            />
        );

        // choose component
        fireEvent.change(screen.getByLabelText('Komponent'), { target: { value: 'comp-1' } });

        // now resource select should have "Student" but not "Employee"
        const resourceSelect = screen.getByLabelText('Ressurs');
        expect(resourceSelect).toHaveTextContent('Student');
        expect(resourceSelect).not.toHaveTextContent('Employee');
    });

    it('submits a FormData with environment, component, resource and action when valid', () => {
        const onSearchSubmit = vi.fn();

        render(
            <LogSearchForm
                onSearchSubmit={onSearchSubmit}
                components={[makeComponent({ name: 'comp-1', description: 'Component 1' })]}
                configs={[makeConfig({ dn: 'dn contains comp-1', classes: [{ name: 'Student', path: '/student' }] })]}
                onFilter={vi.fn()}
            />
        );

        fireEvent.change(screen.getByLabelText('Miljø'), { target: { value: 'api' } });
        fireEvent.change(screen.getByLabelText('Komponent'), { target: { value: 'comp-1' } });
        fireEvent.change(screen.getByLabelText('Ressurs'), { target: { value: 'Student' } });
        fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'GET' } });

        fireEvent.click(screen.getByRole('button', { name: /søk/i }));

        expect(onSearchSubmit).toHaveBeenCalledTimes(1);
        const formData = onSearchSubmit.mock.calls[0][0] as FormData;

        expect(formData.get('environment')).toBe('api');
        expect(formData.get('component')).toBe('comp-1');
        expect(formData.get('resource')).toBe('Student');
        expect(formData.get('action')).toBe('GET');
    });

    it('calls onFilter when typing in filter search field', () => {
        const onFilter = vi.fn();
        render(
            <LogSearchForm
                onSearchSubmit={vi.fn()}
                components={[makeComponent()]}
                configs={[makeConfig()]}
                onFilter={onFilter}
            />
        );

        // NAV Search uses input under the hood; this works with Testing Library
        fireEvent.change(screen.getByLabelText('Filtrer på id:'), { target: { value: 'abc' } });

        expect(onFilter).toHaveBeenCalledWith('abc');
    });
});
