import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SwaggerTable from './SwaggerTable';
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

describe('SwaggerTable', () => {
    it('renders swagger URLs for all environments', () => {
        render(<SwaggerTable component={component} />);

        expect(
            screen.getByText('https://api.felleskomponent.no/utdanning/swagger-ui.html')
        ).toBeInTheDocument();
        expect(
            screen.getByText('https://beta.felleskomponent.no/utdanning/swagger-ui.html')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'https://play-with-fint.felleskomponent.no/utdanning/swagger-ui.html'
            )
        ).toBeInTheDocument();
    });
});
