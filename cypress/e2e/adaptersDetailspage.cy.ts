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

describe('Adapters Details Page Tests', () => {
    beforeEach(() => {
        cy.visit('/adapter/jennifer-another-test@adapter.fintlabs.no', { failOnStatusCode: false });
        cy.waitForAppReady();
    });

    it('should display the correct adapter name', () => {
        cy.contains('h2', 'jennifer-another-test').should('be.visible');
    });

    it('should navigate back to adapter list', () => {
        cy.contains('a', 'Adaptere')
            .should('have.attr', 'href', '/adaptere')
            .invoke('attr', 'href')
            .then((href) => {
                cy.visit(href as string, { failOnStatusCode: false });
            });
        cy.location('pathname', { timeout: 10000 }).should('eq', '/adaptere');
        cy.contains('h2', 'Adaptere').should('be.visible');
    });

    it('should display adapter details correctly', () => {
        cy.get('[data-cy="details-Tittel"]').should('contain', 'test');
        cy.get('[data-cy="details-Beskrivelse"]').should('contain', 'test');
    });

    it('should allow updating adapter details', () => {
        cy.get('[data-cy="details-Tittel"]').should('be.visible');
        cy.get('[data-cy="edit-button"] button').first().as('editButton');
        cy.get('@editButton').should('be.visible').and('not.be.disabled');

        cy.get('@editButton').click({ force: true });
        cy.get('body').then(($body) => {
            if ($body.find('[data-cy="details-edit-Tittel"]').length === 0) {
                cy.log('First edit click did not open edit mode, retrying');
                cy.get('@editButton').click({ force: true });
            }
        });

        cy.get('[data-cy="details-edit-Tittel"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-cy="details-edit-Tittel"]', { timeout: 10000 }).clear();
        cy.get('[data-cy="details-edit-Tittel"]').type('testing new description');

        cy.get('[data-cy="edit-button"] button').first().click({ force: true });
        cy.get('[data-cy="details-Tittel"]').should('contain', 'testing new description');
    });

    it('should allow toggling components', () => {
        cy.get('[data-cy^="component-toggle-"]')
            .first()
            .should('be.visible')
            .and('not.be.disabled');
        cy.get('[data-cy^="component-toggle-"]').first().click({ force: true });
    });
});
