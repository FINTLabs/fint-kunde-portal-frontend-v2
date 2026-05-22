import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CustomTabs } from './CustomTabs';

vi.mock('~/components/shared/LoginStatusIcon', () => ({
    LoginStatusIcon: ({ lastLoginTime }: { lastLoginTime?: string | null }) => (
        <div>status:{lastLoginTime ?? 'none'}</div>
    ),
}));

type TabItem = {
    name: string;
    shortDescription: string;
    managed: boolean;
    modelVersion?: string | null;
    lastLogin?: string;
};

const items: TabItem[] = [
    {
        name: 'manuell-adapter',
        shortDescription: 'Manuell adapter',
        managed: false,
        modelVersion: 'V4',
        lastLogin: '2026-05-01T10:00:00.000Z',
    },
    {
        name: 'auto-adapter',
        shortDescription: 'Automatisk adapter',
        managed: true,
        modelVersion: null,
        lastLogin: '2026-05-02T10:00:00.000Z',
    },
];

describe('CustomTabs', () => {
    it('shows unmanaged items by default and handles row/detail click', () => {
        const showDetails = vi.fn();

        render(
            <CustomTabs
                items={items}
                showDetails={showDetails}
                isManaged={(item) => item.managed}
                lastLoginTime={(item) => item.lastLogin}
            />
        );

        expect(screen.getByText('Manuell adapter')).toBeInTheDocument();
        expect(screen.queryByText('Automatisk adapter')).not.toBeInTheDocument();
        expect(screen.getByText('status:2026-05-01T10:00:00.000Z')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Manuell adapter'));
        expect(showDetails).toHaveBeenCalledWith('manuell-adapter');

        fireEvent.click(screen.getByRole('button', { name: 'Rediger' }));
        expect(showDetails).toHaveBeenCalledWith('manuell-adapter');
    });

    it('switches tab and supports item selection toggles', () => {
        const showDetails = vi.fn();
        const toggleSwitch = vi.fn();

        render(
            <CustomTabs
                items={items}
                selectable={true}
                selectedItems={['manuell-adapter']}
                toggleSwitch={toggleSwitch}
                showDetails={showDetails}
                isManaged={(item) => item.managed}
            />
        );

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
        fireEvent.click(checkbox);
        expect(toggleSwitch).toHaveBeenCalledWith('manuell-adapter', false);

        fireEvent.click(screen.getByRole('radio', { name: 'Automatisk opprettet' }));
        expect(screen.getByText('Automatisk adapter')).toBeInTheDocument();
        expect(screen.getByText('Model version utdanningsdomenet: V3')).toBeInTheDocument();
    });
});
