import { describe, expect, it } from 'vitest';
import { getHelpData } from './HelpData';

describe('getHelpData', () => {
    it('maps help ids into translated HelpDataItem objects', () => {
        const t = (key: string) => `tr:${key}`; // simple fake translator

        const data = getHelpData(t as any);

        expect(data.length).toBeGreaterThan(0);

        // spot-check a few known ids from helpIds
        const basistest = data.find((x) => x.id === 'basistest')!;
        expect(basistest).toEqual({
            id: 'basistest',
            title: 'tr:help.basistest.title',
            shortDescription: 'tr:help.basistest.shortDescription',
            description: 'tr:help.basistest.description',
        });

        const contacts = data.find((x) => x.id === 'contacts')!;
        expect(contacts.title).toBe('tr:help.contacts.title');
    });
});
