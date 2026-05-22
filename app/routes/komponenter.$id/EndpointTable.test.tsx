import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import EndpointTable from './EndpointTable';
import type { IComponent } from '~/types/Component';

const component = {
    dn: 'dn-comp-1',
    name: 'comp-1',
    description: 'Component 1',
    organisations: [],
    clients: [],
    adapters: [],
    basePath: '/utdanning',
    port: null,
    core: false,
    openData: false,
    common: false,
    cacheDisabledFor: [],
    inProduction: true,
    inBeta: false,
    inPlayWithFint: false,
} satisfies IComponent;

describe('EndpointTable', () => {
    it('renders production, beta and play-with-fint endpoint URLs', () => {
        render(<EndpointTable component={component} />);

        expect(screen.getByText('Produksjon')).toBeInTheDocument();
        expect(screen.getByText('Beta')).toBeInTheDocument();
        expect(screen.getByText('Play-with-FINT')).toBeInTheDocument();
        expect(
            screen.getByText('https://api.felleskomponent.no/utdanning')
        ).toBeInTheDocument();
        expect(
            screen.getByText('https://beta.felleskomponent.no/utdanning')
        ).toBeInTheDocument();
        expect(
            screen.getByText('https://play-with-fint.felleskomponent.no/utdanning')
        ).toBeInTheDocument();
    });
});
