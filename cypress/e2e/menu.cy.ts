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
describe('Menu Component Tests', () => {
    beforeEach(() => {
        // Visit the root page before each test
        // cy.viewport('macbook-15'); // Simulate a 15-inch MacBook screen

        cy.visit('http://localhost:3000/', { failOnStatusCode: false });
    });

    it('should display all main menu items', () => {
        // Verify that each main menu item is present.
        const menuItems = ['TILGANGER', 'HELSE'];
        menuItems.forEach((item) => {
            cy.contains('button', item).should('be.visible');
        });
    });

    it('should open and close the first dropdown menu', () => {
        // Open the first dropdown menu using data-testid
        cy.get('[data-testid="dropdown-0"]').click();
        cy.get('[data-testid="submenu-0"]').should('be.visible');

        // Close the first dropdown menu
        cy.get('[data-testid="dropdown-0"]').click();
        cy.get('[data-testid="submenu-0"]').should('not.exist');
    });

    it('should navigate to the correct path when a submenu item is clicked', () => {
        // Open the 'TILGANGER' dropdown
        cy.get('[data-testid="dropdown-0"]').click();

        // Click on the first submenu item and verify navigation
        cy.get('[data-testid="submenu-item-0-0"]').click();
        cy.url().should('include', '/kontakter');
    });

    it('should open and close the second dropdown menu', () => {
        // Open the second dropdown menu using data-testid
        cy.get('[data-testid="dropdown-1"]').click();
        cy.get('[data-testid="submenu-1"]').should('be.visible');

        // Close the second dropdown menu
        cy.get('[data-testid="dropdown-1"]').click();
        cy.get('[data-testid="submenu-1"]').should('not.exist');
    });
});
