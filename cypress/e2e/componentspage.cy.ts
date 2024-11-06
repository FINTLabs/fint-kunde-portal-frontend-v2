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

describe('Components Page Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/', { failOnStatusCode: false });
        cy.visit('http://localhost:3000/komponenter', { failOnStatusCode: false });
    });

    // Header Tests
    it('should display the correct breadcrumb', () => {
        cy.get('.navds-stack > .navds-heading').contains('Komponenter');
    });

    // Form Header Test
    it('should display at least one form header', () => {
        cy.get('.navds-form-summary__header').should('exist');
    });

    // Form Answers Test
    it('should display at least one form answers section', () => {
        cy.get('.navds-form-summary__answers').should('exist');
    });

    // Checkbox Test
    it('should have one or more checkboxes for Komponenter', () => {
        cy.get('.navds-checkboxes').should('have.length.greaterThan', 0);
    });
});
