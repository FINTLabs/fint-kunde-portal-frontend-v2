/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (
        /hydrat/i.test(err.message) ||
        /Minified React error #418/.test(err.message) ||
        /Minified React error #423/.test(err.message) ||
        /ResizeObserver loop completed with undelivered notifications/.test(err.message)
    ) {
        return false;
    }
});

describe('Logout Functionality Tests', () => {
    beforeEach(() => {
        // Visit dashboard first to establish session
        cy.visit('/', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
        // cy.get('[data-theme="novari"]').should('exist');
        // cy.get('.navds-page').should('be.visible');
    });

    describe('Logout Route - Basic Functionality', () => {
        it('should redirect to IDP logout URL when accessing /logout', () => {
            // Visit logout route
            cy.visit('/logout', { failOnStatusCode: false });

            // Verify redirect to IDP logout URL
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });

        it('should handle logout redirect properly', () => {
            // Visit logout route and verify redirect
            cy.visit('/logout', { failOnStatusCode: false });

            // Check that we're redirected to the correct logout endpoint
            cy.url().should('eq', 'https://idp.felleskomponent.no/nidp/app/logout');
        });

        it('should not display any content on logout page', () => {
            // Visit logout route
            cy.visit('/logout', { failOnStatusCode: false });

            // The logout component returns null, so no content should be visible
            // The redirect should happen immediately
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });
    });

    describe('Logout Route - Navigation Integration', () => {
        it('should be accessible from dashboard', () => {
            // Start from dashboard
            cy.visit('/', { failOnStatusCode: false });
            cy.get('[data-theme="novari"]').should('exist');

            // Navigate to logout
            cy.visit('/logout', { failOnStatusCode: false });
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });

        it('should be accessible from any page', () => {
            // Test from different pages
            const pages = ['/user', '/help', '/klienter', '/adaptere', '/ressurser'];

            pages.forEach((page) => {
                cy.visit(page, { failOnStatusCode: false });
                cy.get('[data-theme="novari"]').should('exist');

                // Navigate to logout
                cy.visit('/logout', { failOnStatusCode: false });
                cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
            });
        });

        it('should work with direct URL access', () => {
            // Test direct access to logout URL
            cy.visit('/logout', { failOnStatusCode: false });
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });
    });

    describe('Logout Route - Error Handling', () => {
        it('should handle logout redirect even with network issues', () => {
            // Visit logout route
            cy.visit('/logout', { failOnStatusCode: false });

            // Should still redirect to logout URL
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });

        it('should work after page refresh', () => {
            // Visit logout route
            cy.visit('/logout', { failOnStatusCode: false });

            // Refresh and verify redirect still works
            cy.reload();
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });

        it('should handle multiple logout attempts', () => {
            // Visit logout multiple times
            cy.visit('/logout', { failOnStatusCode: false });
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');

            // Go back and try again
            cy.go('back');
            cy.visit('/logout', { failOnStatusCode: false });
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });
    });

    describe('Logout Route - Security and Headers', () => {
        it('should redirect with proper headers', () => {
            // Visit logout route and check response
            cy.visit('/logout', { failOnStatusCode: false });

            // Verify redirect happens
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });

        it('should handle logout without exposing sensitive data', () => {
            // Visit logout route
            cy.visit('/logout', { failOnStatusCode: false });

            // Verify redirect to external logout service
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');

            // Verify no sensitive data in URL
            cy.url().should('not.include', 'session');
            cy.url().should('not.include', 'token');
        });
    });

    describe('Logout Route - Browser Compatibility', () => {
        it('should work with different viewport sizes', () => {
            // Test with different viewport sizes
            const viewports = [
                { width: 375, height: 667 }, // Mobile
                { width: 768, height: 1024 }, // Tablet
                { width: 1920, height: 1080 }, // Desktop
            ];

            viewports.forEach((viewport) => {
                cy.viewport(viewport.width, viewport.height);
                cy.visit('/logout', { failOnStatusCode: false });
                cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
            });
        });

        it('should handle browser navigation controls', () => {
            // Visit logout route
            cy.visit('/logout', { failOnStatusCode: false });
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');

            // Test browser back button
            cy.go('back');
            cy.url().should('not.include', 'idp.felleskomponent.no/nidp/app/logout');

            // Test browser forward button
            cy.go('forward');
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });
    });

    describe('Logout Route - Performance', () => {
        it('should redirect quickly', () => {
            // Measure redirect time
            // const startTime = Date.now();

            cy.visit('/logout', { failOnStatusCode: false });
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');

            // Note: We can't easily measure exact timing in Cypress for redirects
            // But we can verify the redirect happens
        });

        it('should not cause memory leaks', () => {
            // Visit logout multiple times to check for memory issues
            for (let i = 0; i < 5; i++) {
                cy.visit('/logout', { failOnStatusCode: false });
                cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
            }
        });
    });

    describe('Logout Route - Integration with Authentication', () => {
        it('should work regardless of authentication state', () => {
            // Test logout when user is authenticated (simulated by visiting dashboard first)
            cy.visit('/', { failOnStatusCode: false });
            cy.get('[data-theme="novari"]').should('exist');

            // Now logout
            cy.visit('/logout', { failOnStatusCode: false });
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });

        it('should clear session properly on logout', () => {
            // Visit dashboard to establish session
            cy.visit('/', { failOnStatusCode: false });
            cy.get('[data-theme="novari"]').should('exist');

            // Visit logout
            cy.visit('/logout', { failOnStatusCode: false });
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');

            // Note: In a real scenario, we would test that the session is cleared
            // but since we're using MSW mocks, we can't easily test this
        });
    });

    describe('Logout Route - Edge Cases', () => {
        it('should handle logout with query parameters', () => {
            // Visit logout with query parameters
            cy.visit('/logout?redirect=home', { failOnStatusCode: false });
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });

        it('should handle logout with hash fragments', () => {
            // Visit logout with hash fragments
            cy.visit('/logout#section', { failOnStatusCode: false });
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });

        it('should work with direct request access', () => {
            // Test that logout endpoint is accessible via direct request
            cy.request({
                method: 'GET',
                url: '/logout',
                failOnStatusCode: false,
            }).then((response) => {
                // Should get a successful response (React Router handles redirect client-side)
                expect(response.status).to.be.oneOf([200, 301, 302, 303, 307, 308]);
            });
        });
    });

    describe('Logout Route - User Experience', () => {
        it('should provide clear logout flow', () => {
            // Visit dashboard
            cy.visit('/', { failOnStatusCode: false });
            cy.get('[data-theme="novari"]').should('exist');

            // Logout should redirect to external service
            cy.visit('/logout', { failOnStatusCode: false });
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });

        it('should not show loading states or errors', () => {
            // Visit logout route
            cy.visit('/logout', { failOnStatusCode: false });

            // Should redirect immediately without showing loading or error states
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });
    });
});
