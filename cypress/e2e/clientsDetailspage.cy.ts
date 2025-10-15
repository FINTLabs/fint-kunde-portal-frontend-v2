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

describe('Clients Details Page Tests', () => {
    beforeEach(() => {
        // cy.visit('/klienter/jennifer-test-test@client.fintlabs.no', {
        //     failOnStatusCode: false,
        // }).then(() => {
        //     cy.waitForAppReady();
        // });
        cy.visit('/klienter/jennifer-test-test@client.fintlabs.no', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
    });

    it('should display the correct adapter name', () => {
        cy.get('[data-cy="page-title"]').should('contain', 'test');
    });

    it('should navigate back to adapter list', () => {
        cy.get('[data-cy="back-button"]').click();
        cy.url().should('include', '/klienter');
        cy.reload();
        cy.waitForAppReady();
    });

    it('should display client details correctly', () => {
        // cy.get('[data-cy="detail-name"]').should('contain', 'jennifer-another-test');
        cy.get('[data-cy="details-Tittel"]').should('contain', 'test');
        cy.get('[data-cy="details-Beskrivelse"]').should('contain', 'test');
    });

    it('should allow updating client details', () => {
        cy.get('[data-cy="edit-button"]').find('button').first().should('be.visible');
        cy.get('[data-cy="edit-button"]').find('button').first().should('not.be.disabled');
        cy.get('[data-cy="edit-button"]').find('button').first().click({ waitForAnimations: true });
        cy.wait(1000);

        cy.get('input[type="text"]').should('have.length.greaterThan', 0);
        cy.log('Edit mode activated successfully');
        cy.get('[data-cy="edit-button"]').find('button').first().click();
    });

    it('should allow toggling components', () => {
        cy.get('[data-cy="component-toggle-fullmakt"]').should('be.visible');
        cy.get('[data-cy="component-toggle-fullmakt"]').should('not.be.disabled');
        cy.get('[data-cy="component-toggle-fullmakt"]').click();
        // cy.get('.navds-alert').should('exist');
    });
});
