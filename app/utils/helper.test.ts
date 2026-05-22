import { describe, expect, it } from 'vitest';

import { getComponentIds } from './helper';

describe('getComponentIds', () => {
    it('extracts ou values from dn strings', () => {
        expect(
            getComponentIds([
                'ou=utdanning-elev,ou=components,o=fint',
                'ou=okonomi-faktura,ou=components,o=fint',
            ])
        ).toEqual(['utdanning-elev', 'okonomi-faktura']);
    });

    it('returns empty string when ou value is missing', () => {
        expect(getComponentIds(['cn=missing-component,o=fint'])).toEqual(['']);
    });
});
