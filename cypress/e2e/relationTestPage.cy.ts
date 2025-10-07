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

describe('relasjonstest Details Page Tests', () => {
    beforeEach(() => {
        cy.visit('/relasjonstest', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
    });

    it('should display the correct name', () => {
        cy.get('[data-cy="page-title"]').should('contain', 'Relasjonstest');
    });
});
