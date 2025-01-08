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
describe('Contacts Page Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/', { failOnStatusCode: false });
        cy.visit('http://localhost:3000/kontakter', { failOnStatusCode: false });
    });

    // Breadcrumbs Tests
    it('should display the correct breadcrumb', () => {
        // cy.contains('nav', 'Kontakter').should('be.visible');
        cy.get('.navds-stack > .navds-heading').contains('Kontakter');
    });

    // // Technical Contacts Table Tests
    it('should render the technical contacts table if data is present', () => {
        cy.get('table').should('exist');
        cy.get('table thead').should('be.visible');
        cy.get('table tbody tr').should('have.length.greaterThan', 0);
    });

    // Legal Contact Information Tests
    // it('should display legal contact information if available', () => {
    //     cy.get('.m-10').within(() => {
    //         cy.contains('Juridisk kontakt').should('be.visible');
    //         cy.get('.BodyShort').should('contain', 'Ingen juridisk kontakt funnet');
    //     });
    // });

    // Check table row expansion
    it('should expand a row', () => {
        cy.get(
            ':nth-child(1) > .navds-table__toggle-expand-cell > .navds-table__toggle-expand-button'
        ).click();
        cy.wait(1500);
    });

    // Modal Interaction Tests
    it('should open and close the modal when clicking the "Legg til" button', () => {
        // Open the modal
        cy.get('button').contains('Legg til').click();
        cy.get('.navds-modal').should('be.visible');

        cy.get('[data-cy="contact-text-filter"]').type('Spiff');
        cy.wait(1500);

        cy.get('[width="1"] > .navds-button').click();
        cy.get('.navds-alert').should('exist');
    });
});
