import { beforeEach, describe, expect, it } from 'vitest';

import { HeaderProperties } from './headerProperties';

describe('HeaderProperties', () => {
    beforeEach(() => {
        HeaderProperties.xnin = '';
        HeaderProperties.cookies = '';
        HeaderProperties.username = '';
    });

    it('reads request headers via setProperties', () => {
        const request = new Request('http://localhost/', {
            headers: {
                'x-nin': '12345678901',
                Cookie: 'organisation=fint-org',
                'x-username': 'ola.nordmann',
            },
        });

        HeaderProperties.setProperties(request);

        expect(HeaderProperties.getXnin()).toBe('12345678901');
        expect(HeaderProperties.getCookie()).toBe('organisation=fint-org');
        expect(HeaderProperties.getUsername()).toBe('ola.nordmann');
    });

    it('keeps existing username when x-username header is missing', () => {
        HeaderProperties.setUsername('existing-user');

        HeaderProperties.setProperties(new Request('http://localhost/'));

        expect(HeaderProperties.getUsername()).toBe('existing-user');
    });

    it('updates username via setUsername', () => {
        HeaderProperties.setUsername('new-user');

        expect(HeaderProperties.getUsername()).toBe('new-user');
    });
});
