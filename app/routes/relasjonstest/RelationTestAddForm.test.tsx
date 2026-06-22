import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import RelationTestAddForm from './RelationTestAddForm';
import type { IComponent } from '~/types/Component';
import type { IComponentConfig } from '~/types/ComponentConfig';

function makeComponent(overrides: Partial<IComponent> = {}): IComponent {
    return {
        dn: 'dn-comp-1',
        name: 'comp-1',
        description: 'Component 1',
        organisations: [],
        clients: [],
        adapters: [],
        basePath: '/comp-1',
        port: null,
        core: false,
        openData: false,
        common: false,
        cacheDisabledFor: [],
        inProduction: false,
        inBeta: false,
        inPlayWithFint: true,
        ...overrides,
    };
}

function makeConfig(overrides: Partial<IComponentConfig> = {}): IComponentConfig {
    return {
        dn: 'something dn-comp-1 something',
        name: 'config-1',
        displayName: 'Config 1',
        path: '/utdanning',
        assetPath: '/asset-1',
        classes: [{ name: 'Student', path: '/student' }],
        core: false,
        inProduction: false,
        inBeta: false,
        inPlayWithFint: true,
        ...overrides,
    };
}

describe('RelationTestAddForm', () => {
    it('shows validation error when component is missing', () => {
        const runTest = vi.fn();

        render(
            <RelationTestAddForm
                components={[makeComponent()]}
                configs={[makeConfig()]}
                runTest={runTest}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /kjør/i }));

        expect(screen.getAllByText('påkrevd').length).toBeGreaterThan(0);
        expect(runTest).not.toHaveBeenCalled();
    });

    it('enables resource select when matching config is found', () => {
        render(
            <RelationTestAddForm
                components={[makeComponent()]}
                configs={[makeConfig()]}
                runTest={vi.fn()}
            />
        );

        expect(screen.getByLabelText('Ressurs')).toBeDisabled();

        fireEvent.change(screen.getByLabelText('Komponent'), {
            target: { value: 'dn-comp-1' },
        });

        expect(screen.getByLabelText('Ressurs')).toBeEnabled();
        expect(screen.getByLabelText('Ressurs')).toHaveTextContent('Student');
    });

    it('submits full test url when form is valid', () => {
        const runTest = vi.fn();

        render(
            <RelationTestAddForm
                components={[makeComponent()]}
                configs={[makeConfig()]}
                runTest={runTest}
            />
        );

        fireEvent.change(screen.getByLabelText('Komponent'), {
            target: { value: 'dn-comp-1' },
        });
        fireEvent.click(screen.getByRole('button', { name: /kjør/i }));

        expect(runTest).toHaveBeenCalledWith(
            'https://play-with-fint.felleskomponent.no/utdanning'
        );
    });

    it('uses selected environment in submitted url', () => {
        const runTest = vi.fn();

        render(
            <RelationTestAddForm
                components={[makeComponent()]}
                configs={[makeConfig()]}
                runTest={runTest}
            />
        );

        fireEvent.change(screen.getByLabelText('Miljø'), {
            target: { value: 'https://api.felleskomponent.no' },
        });
        fireEvent.change(screen.getByLabelText('Komponent'), {
            target: { value: 'dn-comp-1' },
        });
        fireEvent.click(screen.getByRole('button', { name: /kjør/i }));

        expect(runTest).toHaveBeenCalledWith('https://api.felleskomponent.no/utdanning');
    });
});
