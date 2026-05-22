import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';

import BrokenLinksFilterForm from './BrokenLinksFilterForm';

const defaultOptions = {
    componentOptions: [{ value: 'utdanning_elev', label: 'utdanning_elev' }],
    resourceOptions: [{ value: 'elevforhold', label: 'elevforhold' }],
    problemTypeOptions: [{ value: 'missing-resource', label: 'missing-resource' }],
};

function renderForm(
    props: Partial<React.ComponentProps<typeof BrokenLinksFilterForm>> = {},
    search = ''
) {
    const onSelectChange = vi.fn();
    const searchParams = new URLSearchParams(search);

    const view = render(
        <RouterProvider
            router={createMemoryRouter(
                [
                    {
                        path: '/',
                        element: (
                            <BrokenLinksFilterForm
                                searchParams={searchParams}
                                selectedComponent={null}
                                selectedResource={null}
                                selectedProblemType={null}
                                onSelectChange={onSelectChange}
                                {...defaultOptions}
                                {...props}
                            />
                        ),
                    },
                ],
                { initialEntries: [`/?${search}`] }
            )}
        />
    );

    return { onSelectChange, searchParams, ...view };
}

describe('BrokenLinksFilterForm', () => {
    it('renders filter labels and reset link', () => {
        renderForm();

        expect(screen.getByLabelText('Komponent')).toBeInTheDocument();
        expect(screen.getByLabelText('Ressurs')).toBeInTheDocument();
        expect(screen.getByLabelText('Problemtype')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Nullstill' })).toHaveAttribute(
            'href',
            '/linkwalker/broken'
        );
    });

    it('calls onSelectChange when a filter select changes', () => {
        const { onSelectChange } = renderForm();

        fireEvent.change(screen.getByLabelText('Komponent'), {
            target: { name: 'component', value: 'utdanning_elev' },
        });

        expect(onSelectChange).toHaveBeenCalledWith('component', 'utdanning_elev');
    });

    it('renders hidden size input when size search param is present', () => {
        renderForm({}, 'size=25');

        expect(screen.getByDisplayValue('25', { exact: true })).toHaveAttribute('type', 'hidden');
    });
});
