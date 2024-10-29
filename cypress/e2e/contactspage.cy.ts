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

        // Close the modal
        cy.get('.navds-modal__button').should('be.visible');
        cy.wait(1500);
        cy.get('.navds-modal:visible').within(() => {
            cy.get('button.navds-modal__button.navds-button--icon-only').click();
        });

        cy.get('.navds-modal').then(($modal) => {
            console.log('Modal state after close attempt:', $modal);
        });
        cy.get('.navds-modal').should('not.be.visible');
    });

    // Alert Message Tests
    it('should display and close the alert message', () => {
        // Simulate the fetcher state to trigger the alert
        cy.window().then((win) => {
            (win as any).fetcher = {
                data: { message: 'Test message', variant: 'success', show: true },
                state: 'warning',
            };
        });

        cy.get('.navds-alert').should('be.visible').and('contain', 'Test message');
        cy.get('.navds-alert button[aria-label="Close"]').click();
        cy.get('.navds-alert').should('not.exist');
    });

    //
    // // Form Submission Tests
    // it('should submit the form correctly when adding a technical contact', () => {
    //     // Intercept the form submission request
    //     cy.intercept('POST', '/kontakter', {
    //         statusCode: 200,
    //         body: { message: 'Kontakten er lagt til', variant: 'success' },
    //     });
    //
    //     // Open the modal
    //     cy.get('button').contains('Legg til').click();
    //
    //     // Fill out the form inside the modal (assuming you have form resource with specific names)
    //     cy.get('input[name="contactNin"]').type('12345678901');
    //     cy.get('button[type="submit"]').click();
    //
    //     // Verify API call response handling
    //     cy.get('.navds-alert').should('be.visible').and('contain', 'Kontakten er lagt til');
    // });
});
