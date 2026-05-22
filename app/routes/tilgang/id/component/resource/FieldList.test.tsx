import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import FieldList from './FieldList';
import type { IField } from '~/types/Access';

function makeField(name: string, relation = false, enabled = false): IField {
    return {
        name,
        enabled,
        mustContain: '',
        relation,
    };
}

describe('FieldList', () => {
    it('renders field and relation sections separately', () => {
        render(
            <FieldList
                fieldList={[
                    makeField('systemId', false, true),
                    makeField('navn', false),
                    makeField('skole', true, true),
                ]}
                onToggleField={vi.fn()}
            />
        );

        expect(screen.getByRole('heading', { name: 'Feltnavn' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Relasjoner' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'systemId' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'navn' })).not.toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'skole' })).toBeChecked();
    });

    it('calls onToggleField when checkbox is changed', () => {
        const onToggleField = vi.fn();

        render(
            <FieldList fieldList={[makeField('systemId')]} onToggleField={onToggleField} />
        );

        fireEvent.click(screen.getByRole('checkbox', { name: 'systemId' }));

        expect(onToggleField).toHaveBeenCalledWith('systemId', true);
    });
});
