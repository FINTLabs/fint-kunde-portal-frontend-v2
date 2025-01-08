Cypress.on('uncaught:exception', (err) => {
    // Cypress and React Hydrating the document don't get along
    // for some unknown reason. Hopefully, we figure out why eventually
    // so we can remove this.
    // https://github.com/remix-run/remix/issues/4822#issuecomment-1679195650
    // https://github.com/cypress-io/cypress/issues/27204
    if (
        /hydrat/i.test(err.message) ||
        /Minified React error #418/.test(err.message) ||
        /Minified React error #423/.test(err.message)
    ) {
        return false;
    }
});

describe('Resources Page Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/', { failOnStatusCode: false });
        cy.visit('http://localhost:3000/ressurser', { failOnStatusCode: false });
    });

    // Header Tests
    it('should display the correct title and breadcrumb', () => {
        cy.get('[data-cy="breadcrumb-item"]').should('contain', 'Ressurser');
        cy.get('[data-cy="page-title"]').should('contain', 'Ressurser');
    });

    it('should allow creating a new ', () => {
        cy.get('[data-cy="add-button"]').click();
        cy.get('[data-cy="create-form"]').should('be.visible');
        cy.get('[data-cy="input-name"]').type('New Adapter');
        cy.get('[data-cy="input-description"]').type('This is a test adapter.');
        cy.get('[data-cy="save-button"]').click();

        //cy.url().should('include', '/adapter/New Adapter');
    });

    it('should navigate to details on row click', () => {
        cy.get('[data-cy="details-row"]').first().click();
        cy.url().should('include', '/ressurser/');
    });
});
