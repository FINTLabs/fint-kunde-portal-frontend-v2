import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';

import { DetailsTable } from './DetailsTable';
import type { ComponentSummary } from '~/types';
import type { ComponentProps } from 'react';

function makeComponent(overrides: Partial<ComponentSummary> = {}): ComponentSummary {
    return {
        component: 'utdanning_elev',
        totalRecords: 100,
        totalRefs: 200,
        brokenLinkCount: 5,
        integrityPercent: 97.5,
        byProblemType: { 'missing-resource': 5 },
        resources: [],
        ...overrides,
    };
}

function renderTable(props: ComponentProps<typeof DetailsTable>, initialEntries?: string[]) {
    return render(
        <MemoryRouter initialEntries={initialEntries ?? ['/linkwalker']}>
            <DetailsTable {...props} />
        </MemoryRouter>
    );
}

describe('DetailsTable', () => {
    it('renders empty text when there are no items', () => {
        renderTable({
            items: [],
            emptyText: 'Ingen komponenter registrert.',
        });

        expect(screen.getByText('Ingen komponenter registrert.')).toBeInTheDocument();
    });

    it('renders component rows with formatted titles and broken link button', () => {
        renderTable({
            items: [makeComponent()],
            getErrorHref: (item) => `/linkwalker/broken?component=${item.component}`,
            emptyText: 'Ingen komponenter registrert.',
        });

        expect(screen.getByText('utdanning elev')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Brutte lenker/i })).toHaveAttribute(
            'href',
            '/linkwalker/broken?component=utdanning_elev'
        );
    });

    it('renders resource details in expandable row', async () => {
        renderTable({
            items: [
                makeComponent({
                    resources: [
                        {
                            resource: 'person_person',
                            totalRecords: 50,
                            totalRefs: 80,
                            brokenLinkCount: 2,
                            integrityPercent: 98.5,
                            byProblemType: { 'unknown-link': 2 },
                        },
                    ],
                }),
            ],
            getResourceErrorHref: (component, resource) =>
                `/linkwalker/broken?component=${component.component}&resource=${resource.resource}`,
            emptyText: 'Ingen komponenter registrert.',
        });

        fireEvent.click(screen.getByRole('button', { name: /Vis mer/i }));

        expect(await screen.findByText('person person')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'a11y-titleVis' })).toHaveAttribute(
            'href',
            '/linkwalker/broken?component=utdanning_elev&resource=person_person'
        );
    });

    it('hides broken link buttons when there are no broken links', () => {
        renderTable({
            items: [makeComponent({ brokenLinkCount: 0 })],
            getErrorHref: (item) => `/linkwalker/broken?component=${item.component}`,
            emptyText: 'Ingen komponenter registrert.',
        });

        expect(screen.queryByRole('button', { name: /Brutte lenker/i })).not.toBeInTheDocument();
    });
});
