import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ComponentDetails from './ComponentDetails';
import type { IComponent } from '~/types/Component';

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
        inProduction: true,
        inBeta: true,
        inPlayWithFint: true,
        ...overrides,
    };
}

describe('ComponentDetails', () => {
    it('renders component name, description and base path', () => {
        render(<ComponentDetails component={makeComponent()} />);

        expect(screen.getByText('comp-1')).toBeInTheDocument();
        expect(screen.getByText('Component 1')).toBeInTheDocument();
        expect(screen.getByText('/comp-1')).toBeInTheDocument();
    });

    it('checks environment boxes based on component flags', () => {
        render(
            <ComponentDetails
                component={makeComponent({
                    inProduction: true,
                    inBeta: true,
                    inPlayWithFint: false,
                })}
            />
        );

        expect(screen.getByRole('checkbox', { name: 'API' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Beta' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Play with FINT' })).not.toBeChecked();
    });

    it('renders availability and environment checkbox groups', () => {
        render(<ComponentDetails component={makeComponent()} />);

        expect(screen.getByText('Tilgjengelighet')).toBeInTheDocument();
        expect(screen.getByText('Miljø')).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Åpne data' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Felles' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Play with FINT' })).toBeInTheDocument();
    });
});
