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

describe('Tilgang (Access) Routes Tests', () => {
    // Mock client and adapter names for testing
    const testClient = 'jennifer-test-test@client.fintlabs.no';
    const testAdapter = 'jennifer-another-test@adapter.fintlabs.no';
    const testComponent = 'administrasjon-fullmakt';

    beforeEach(() => {
        // Visit a base page to establish session
        // cy.visit('/klienter', { failOnStatusCode: false }).then(() => {
        //     cy.waitForAppReady();
        // });

        cy.visit('/klienter', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
    });

    describe('Access Component Route (/tilgang/id/component)', () => {
        it('should display access component page for client', () => {
            // Navigate to access component page
            // cy.visit(`/tilgang/${testClient}/${testComponent}`, { failOnStatusCode: false }).then(
            //     () => {
            //         cy.waitForAppReady();
            //     }
            // );
            // cy.reload();
            cy.visit(`/tilgang/${testClient}/${testComponent}`, { failOnStatusCode: false });
            cy.reload();

            // Should load the page
            cy.get('[data-theme="novari"]').should('exist');
            cy.get('.navds-page').should('be.visible');
        });

        it('should display access component page for adapter', () => {
            // Navigate to access component page for adapter
            // cy.visit(`/tilgang/${testAdapter}/${testComponent}`, { failOnStatusCode: false }).then(
            //     () => {
            //         cy.waitForAppReady();
            //     }
            // );
            // cy.reload();
            cy.visit(`/tilgang/${testAdapter}/${testComponent}`, { failOnStatusCode: false });
            cy.reload();

            // Should load the page
            cy.get('[data-theme="novari"]').should('exist');
            cy.get('.navds-page').should('be.visible');
        });

        it('should display correct breadcrumbs for client access', () => {
            // cy.visit(`/tilgang/${testClient}/${testComponent}`, { failOnStatusCode: false }).then(
            //     () => {
            //         cy.waitForAppReady();
            //     }
            // );
            cy.visit(`/tilgang/${testClient}/${testComponent}`, { failOnStatusCode: false });
            cy.reload();
            // console.log('testClient', `/tilgang/${testClient}/${testComponent}`);
            // //cy.visit(`/tilgang/jennifer-another-test@client.fintlabs.no/administrasjon-fullmakt`, { failOnStatusCode: false });
            // cy.reload();

            // Should have breadcrumbs
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');
            cy.contains('klienter').should('be.visible');
            cy.contains(testClient).should('be.visible');
            cy.contains(testComponent).should('be.visible');
        });

        it('should display correct breadcrumbs for adapter access', () => {
            // cy.visit(`/tilgang/${testAdapter}/${testComponent}`, { failOnStatusCode: false }).then(
            //     () => {
            //         cy.waitForAppReady();
            //     }
            // );
            cy.visit(`/tilgang/${testAdapter}/${testComponent}`, { failOnStatusCode: false });
            cy.waitForAppReady();

            // Should have breadcrumbs
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');
            cy.contains('adapter').should('be.visible');
            cy.contains(testAdapter).should('be.visible');
            cy.contains(testComponent).should('be.visible');
        });

        it('should display page header with correct title', () => {
            // cy.visit(`/tilgang/${testClient}/${testComponent}`, { failOnStatusCode: false }).then(
            //     () => {
            //         cy.waitForAppReady();
            //     }
            // );
            // cy.reload();
            cy.visit(`/tilgang/${testClient}/${testComponent}`, { failOnStatusCode: false });
            cy.waitForAppReady();

            // Should have page header
            cy.get('[data-cy="internal-page-header"]').should('be.visible');
            cy.get('[data-cy="page-title"]').should('be.visible');
        });

        it('should display resources list if available', () => {
            // cy.visit(`/tilgang/${testClient}/${testComponent}`, { failOnStatusCode: false }).then(
            //     () => {
            //         cy.waitForAppReady();
            //     }
            // );
            // cy.reload();
            cy.visit(`/tilgang/${testClient}/${testComponent}`, { failOnStatusCode: false });
            cy.waitForAppReady();

            cy.get('.navds-form-summary__answers').should('be.visible');
        });

        it('should allow navigation to resource details', () => {
            // cy.visit(`/tilgang/${testClient}/${testComponent}`, { failOnStatusCode: false }).then(
            //     () => {
            //         cy.waitForAppReady();
            //     }
            // );
            // cy.reload();
            cy.visit(`/tilgang/${testClient}/${testComponent}`, { failOnStatusCode: false });
            cy.waitForAppReady();

            // Look for clickable resource items
            cy.get('.navds-form-summary__answers').should('be.visible');
        });

        it('should handle resource toggle functionality', () => {
            // cy.visit(`/tilgang/${testClient}/${testComponent}`, { failOnStatusCode: false }).then(
            //     () => {
            //         cy.waitForAppReady();
            //     }
            // );
            // cy.reload();
            cy.visit(`/tilgang/${testClient}/${testComponent}`, { failOnStatusCode: false });
            cy.waitForAppReady();

            // Look for toggle switches or buttons
            cy.get('[data-cy="resource-toggle-string"]').should('be.visible');

            cy.get('[data-cy="resource-toggle-string"]').click();

            cy.get('.navds-alert').should('exist');
            // Should show some feedback
            cy.get('body').should('be.visible');
        });
    });
});
