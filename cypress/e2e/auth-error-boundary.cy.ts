/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
    if (
        /hydrat/i.test(err.message) ||
        /Minified React error #418/.test(err.message) ||
        /Minified React error #423/.test(err.message)
    ) {
        return false;
    }
});

describe.skip('Authentication Error Boundary Tests', () => {
    beforeEach(() => {
        // Clear any existing cookies or session data
        cy.clearCookies();
        cy.clearLocalStorage();
        // Reset to normal handlers before each test
        // (Cypress as any).resetToNormalHandlers();
    });

    describe('User Not Found Error (406)', () => {
        it('should display user not found error when /api/me returns 404', () => {
            // Set handler mode to return 404 for /api/me
            // (Cypress as any).setAuthErrorHandlers('user_not_found');

            // cy.visit('/', { failOnStatusCode: false }).then(() => {
            //     cy.waitForAppReady();
            // });
            cy.visit('/', { failOnStatusCode: false });
            cy.reload();

            // Wait for error page to load
            cy.get('h1', { timeout: 10000 }).should('contain', 'Du har ikke opprettet bruker.');
            cy.get('button').should('contain', 'Trykk her for å opprette konto');

            // Verify the registration link
            cy.get('a').should('have.attr', 'href', 'https://registrering.felleskomponent.no');
        });

        it('should allow user to navigate to registration page', () => {
            // (Cypress as any).setAuthErrorHandlers('user_not_found');

            // cy.visit('/', { failOnStatusCode: false }).then(() => {
            //     cy.waitForAppReady();
            // });
            cy.visit('/', { failOnStatusCode: false });
            cy.waitForAppReady();

            // Click the registration button
            cy.get('button').contains('Trykk her for å opprette konto').click();

            // Verify navigation to registration page
            cy.url().should('include', 'registrering.felleskomponent.no');
        });
    });

    describe('No Organization Access Error (401)', () => {
        it('should display no organization access error when user has no organizations', () => {
            //(Cypress as any).setAuthErrorHandlers('no_org');

            // cy.visit('/', { failOnStatusCode: false });

            // Wait for error page to load
            cy.get('h1', { timeout: 10000 }).should(
                'contain',
                'Du er ikke tilknyttet en organisasjon'
            );
            cy.get('h1').should('contain', 'Gå til FINT administratoren i organisasjonen din');
        });

        it('should display no organization access when organizations API returns 401', () => {
            // (Cypress as any).setAuthErrorHandlers('no_org_unauthorized');

            // cy.visit('/', { failOnStatusCode: false }).then(() => {
            //     cy.waitForAppReady();
            // });
            cy.visit('/', { failOnStatusCode: false });
            cy.waitForAppReady();

            // Verify the no organization error is displayed
            cy.get('h1', { timeout: 10000 }).should(
                'contain',
                'Du er ikke tilknyttet en organisasjon'
            );
        });
    });

    describe('Insufficient Permissions Error (403)', () => {
        it('should display insufficient permissions error when accessing restricted resource', () => {
            // (Cypress as any).setAuthErrorHandlers('forbidden');

            // cy.visit('/', { failOnStatusCode: false }).then(() => {
            //     cy.waitForAppReady();
            // });
            cy.visit('/', { failOnStatusCode: false });
            cy.waitForAppReady();

            // Navigate to a page that requires permissions
            cy.visit('/klienter', { failOnStatusCode: false });

            // Wait for error to be displayed
            cy.get('h1', { timeout: 10000 }).should(
                'contain',
                'Du har ikke tilgang til dette området'
            );
            cy.get('h1').should('contain', 'kontakt fint-administratoren din');
        });

        it('should allow user to navigate back to dashboard from no access error', () => {
            // (Cypress as any).setAuthErrorHandlers('forbidden');

            // cy.visit('/klienter', { failOnStatusCode: false }).then(() => {
            //     cy.waitForAppReady();
            // });
            cy.visit('/klienter', { failOnStatusCode: false });
            cy.waitForAppReady();

            // Wait for error page and click the dashboard button
            cy.get('button', { timeout: 10000 }).contains('Gå til Kundeportalen Dashboard').click();

            // Verify navigation back to home
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });
    });

    describe('General Error Handling (500)', () => {
        it('should display general error page for server errors', () => {
            // (Cypress as any).setAuthErrorHandlers('server_error');

            // cy.visit('/', { failOnStatusCode: false }).then(() => {
            //     cy.waitForAppReady();
            // });
            cy.visit('/', { failOnStatusCode: false });
            cy.waitForAppReady();

            // Verify the general error page is displayed
            cy.get('h1', { timeout: 10000 }).should('contain', 'Beklager, noe gikk galt.');
            cy.get('body').should('contain', 'En teknisk feil på våre servere');
        });

        it('should display network error when API is unreachable', () => {
            // (Cypress as any).setAuthErrorHandlers('network_error');

            // cy.visit('/', { failOnStatusCode: false }).then(() => {
            //     cy.waitForAppReady();
            // });
            cy.visit('/', { failOnStatusCode: false });
            cy.waitForAppReady();

            // Verify error handling for network issues
            cy.get('h1', { timeout: 10000 }).should('contain', 'Beklager, noe gikk galt.');
        });
    });

    describe('Logout Functionality', () => {
        it('should redirect to logout URL when logout route is accessed', () => {
            // (Cypress as any).setAuthErrorHandlers('normal');

            // cy.visit('/', { failOnStatusCode: false }).then(() => {
            //     cy.waitForAppReady();
            // });
            cy.visit('/', { failOnStatusCode: false });
            cy.waitForAppReady();

            // Visit logout route
            cy.visit('/logout', { failOnStatusCode: false });

            // Verify redirect to external logout URL
            cy.url().should('include', 'idp.felleskomponent.no/nidp/app/logout');
        });

        it('should verify header exists for logout functionality', () => {
            // (Cypress as any).setAuthErrorHandlers('normal');

            cy.visit('/', { failOnStatusCode: false });

            // Look for header component
            cy.get('[data-cy="novari-header"]', { timeout: 10000 }).should('be.visible');
        });
    });

    describe('Error Recovery', () => {
        it('should allow page refresh after error', () => {
            // Set up initial error
            // (Cypress as any).setAuthErrorHandlers('user_not_found');

            // cy.visit('/', { failOnStatusCode: false }).then(() => {
            //     cy.waitForAppReady();
            // });
            cy.visit('/', { failOnStatusCode: false });
            cy.waitForAppReady();

            // Verify error is displayed
            cy.get('h1', { timeout: 10000 }).should('contain', 'Du har ikke opprettet bruker.');

            // Now set up normal handlers and refresh
            // (Cypress as any).setAuthErrorHandlers('normal');

            cy.reload();

            // Verify normal page loads after refresh
            cy.get('[data-theme="novari"]', { timeout: 10000 }).should('exist');
            cy.get('.navds-page').should('be.visible');
        });

        it('should handle navigation after errors', () => {
            // Test navigation after error states
            cy.visit('/non-existent-route', { failOnStatusCode: false });

            // Navigate to home with normal mode
            // (Cypress as any).setAuthErrorHandlers('normal');
            // cy.visit('/', { failOnStatusCode: false }).then(() => {
            //     cy.waitForAppReady();
            // });
            cy.visit('/', { failOnStatusCode: false });
            cy.waitForAppReady();

            // Verify navigation works
            cy.get('body', { timeout: 10000 }).should('be.visible');
        });
    });
});
