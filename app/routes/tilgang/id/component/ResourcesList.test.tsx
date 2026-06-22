import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ResourcesList from './ResourcesList';
import type { IAccessComponent } from '~/types/Access';

function makeResource(name: string, enabled = false): IAccessComponent {
    return {
        name,
        enabled,
        writeable: false,
        readingOption: 'MULTIPLE',
        fields: [],
    };
}

describe('ResourcesList', () => {
    it('renders title and resource checkboxes', () => {
        render(
            <ResourcesList
                accessComponent={[makeResource('elev', true), makeResource('person')]}
                title="client-a/utdanning-elev"
                onSelected={vi.fn()}
                onToggle={vi.fn()}
                onBulkToggle={vi.fn()}
            />
        );

        expect(screen.getByRole('heading', { name: 'client-a/utdanning-elev' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'elev' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'person' })).not.toBeChecked();
    });

    it('calls onToggle with resource and enabled flag', () => {
        const onToggle = vi.fn();

        render(
            <ResourcesList
                accessComponent={[makeResource('elev')]}
                title="client-a/utdanning-elev"
                onSelected={vi.fn()}
                onToggle={onToggle}
                onBulkToggle={vi.fn()}
            />
        );

        fireEvent.click(screen.getByRole('checkbox', { name: 'elev' }));

        expect(onToggle).toHaveBeenCalledTimes(1);
        const formData = onToggle.mock.calls[0][0] as FormData;
        expect(formData.get('resource')).toBe('elev');
        expect(formData.get('enabled')).toBe('true');
    });

    it('calls onBulkToggle with disabled resources for select all', () => {
        const onBulkToggle = vi.fn();

        render(
            <ResourcesList
                accessComponent={[makeResource('elev', true), makeResource('person')]}
                title="client-a/utdanning-elev"
                onSelected={vi.fn()}
                onToggle={vi.fn()}
                onBulkToggle={onBulkToggle}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Velg alle' }));

        expect(onBulkToggle).toHaveBeenCalledTimes(1);
        const formData = onBulkToggle.mock.calls[0][0] as FormData;
        expect(JSON.parse(formData.get('resources') as string)).toEqual([
            {
                component: 'person',
                resource: 'person',
                enabled: true,
                writeable: false,
                readingOption: 'MULTIPLE',
            },
        ]);
    });

    it('calls onBulkToggle with disable flag for deselect all', () => {
        const onBulkToggle = vi.fn();

        render(
            <ResourcesList
                accessComponent={[makeResource('elev', true), makeResource('person')]}
                title="client-a/utdanning-elev"
                onSelected={vi.fn()}
                onToggle={vi.fn()}
                onBulkToggle={onBulkToggle}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Fjern alle' }));

        expect(onBulkToggle).toHaveBeenCalledTimes(1);
        const formData = onBulkToggle.mock.calls[0][0] as FormData;
        expect(formData.get('disable')).toBe('true');
        expect(JSON.parse(formData.get('resources') as string)).toEqual([
            {
                component: 'elev',
                resource: 'elev',
                enabled: false,
                writeable: false,
                readingOption: 'MULTIPLE',
            },
        ]);
    });

    it('calls onSelected when enabled resource details button is clicked', () => {
        const onSelected = vi.fn();

        render(
            <ResourcesList
                accessComponent={[makeResource('elev', true), makeResource('person')]}
                title="client-a/utdanning-elev"
                onSelected={onSelected}
                onToggle={vi.fn()}
                onBulkToggle={vi.fn()}
            />
        );

        const editButtons = screen.getAllByRole('button', { name: 'Rediger' });

        fireEvent.click(editButtons[0]);

        expect(onSelected).toHaveBeenCalledWith('elev');
        expect(editButtons[1]).toBeDisabled();
    });
});
