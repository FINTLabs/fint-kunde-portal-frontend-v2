import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseLoaderData = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useLoaderData: () => mockUseLoaderData(),
    };
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('~/components/shared/breadcrumbs', () => ({
    default: ({ breadcrumbs }: { breadcrumbs: { name: string }[] }) => (
        <div data-testid="breadcrumbs">{breadcrumbs.map((b) => b.name).join(' > ')}</div>
    ),
}));

vi.mock('~/components/shared/InternalPageHeader', () => ({
    InternalPageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock('~/routes/komponenter.$id/ComponentDetails', () => ({
    default: ({ component }: { component: { name: string } }) => (
        <div data-testid="component-details">{component.name}</div>
    ),
}));

vi.mock('~/routes/komponenter.$id/EndpointTable', () => ({
    default: ({ component }: { component: { basePath: string } }) => (
        <div data-testid="endpoint-table">{component.basePath}</div>
    ),
}));

vi.mock('~/routes/komponenter.$id/SwaggerTable', () => ({
    default: ({ component }: { component: { basePath: string } }) => (
        <div data-testid="swagger-table">{component.basePath}</div>
    ),
}));

import Index from './route';

const baseComponent = {
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
    inBeta: false,
    inPlayWithFint: false,
};

describe('komponenter detail route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders component details, endpoints and swagger sections', () => {
        mockUseLoaderData.mockReturnValue(baseComponent);

        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('menu.components > comp-1');
        expect(screen.getByRole('heading', { name: 'Component 1' })).toBeInTheDocument();
        expect(screen.getByText('mainRoutes.componentDetails.detailsHeading')).toBeInTheDocument();
        expect(screen.getByText('mainRoutes.componentDetails.endpointsHeading')).toBeInTheDocument();
        expect(screen.getByText('mainRoutes.componentDetails.swaggerHeading')).toBeInTheDocument();
        expect(screen.getByTestId('component-details')).toHaveTextContent('comp-1');
        expect(screen.getByTestId('endpoint-table')).toHaveTextContent('/comp-1');
        expect(screen.getByTestId('swagger-table')).toHaveTextContent('/comp-1');
    });

    it('shows not found alert when component is missing', () => {
        mockUseLoaderData.mockReturnValue(null);

        render(<Index />);

        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('menu.components');
        expect(
            screen.getByRole('heading', { name: 'mainRoutes.componentDetails.defaultTitle' })
        ).toBeInTheDocument();
        expect(screen.getByText('mainRoutes.componentDetails.notFoundTitle')).toBeInTheDocument();
        expect(screen.getByText('mainRoutes.componentDetails.notFoundDescription')).toBeInTheDocument();
        expect(screen.queryByTestId('component-details')).not.toBeInTheDocument();
    });
});
