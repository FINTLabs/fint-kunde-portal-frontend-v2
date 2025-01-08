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
        cy.visit('http://localhost:3000/', { failOnStatusCode: false });
        cy.visit('http://localhost:3000/adapter/jennifer-another-test@adapter.fintlabs.no', {
            failOnStatusCode: false,
        });
    });

    it('should display the correct adapter name', () => {
        cy.get('[data-cy="page-title"]').should('contain', 'jennifer-another-test');
    });

    it('should navigate back to adapter list', () => {
        cy.get('[data-cy="back-button"]').click();
        cy.url().should('include', '/adaptere');
    });

    it('should display adapter details correctly', () => {
        // cy.get('[data-cy="detail-name"]').should('contain', 'jennifer-another-test');
        cy.get('[data-cy="details-edit-Tittel"]').should('contain', 'test');
        cy.get('[data-cy="details-edit-Beskrivelse"]').should('contain', 'test');
    });

    it('should allow updating adapter details', () => {
        cy.get('[data-cy="edit-button"]').click();
        cy.get('[data-cy="details-edit-Tittel"]').should('exist');
        cy.get('[data-cy="details-edit-Beskrivelse"]').should('exist');
        cy.get('[data-cy="details-edit-Beskrivelse"]').type('testing new description');
        cy.get('[data-cy="save-button"]').click();

        cy.wait(3000);
        cy.get('.navds-alert').should('exist');
    });

    it('should allow toggling components', () => {
        cy.get('[data-cy="component-toggle-administrasjon_fullmakt"]').click();
        cy.get('.navds-alert').should('exist');
    });
});
