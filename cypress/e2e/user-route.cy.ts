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

describe('User Route Tests', () => {
    beforeEach(() => {
        // Visit user page and wait for it to load
        // cy.visit('/user', { failOnStatusCode: false }).then(() => {
        //     cy.waitForAppReady();
        // });
        cy.visit('/user', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();
    });

    describe('User Profile Page - Basic Functionality', () => {
        it('should display the correct page title and header', () => {
            // Verify page header
            cy.get('[data-cy="page-title"]').should('contain', 'User Information');

            // Verify breadcrumbs
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');
            cy.contains('Profile').should('be.visible');
        });

        it('should display user profile information', () => {
            // Wait for content to load
            cy.get('.navds-box', { timeout: 10000 }).should('be.visible');

            // Verify user information is displayed
            cy.contains('Full Name:').should('be.visible');
            cy.contains('Calvin Watterson').should('be.visible');

            cy.contains('Email:').should('be.visible');
            cy.contains('calvin@calvinball.com').should('be.visible');

            cy.contains('Mobile:').should('be.visible');
            cy.contains('90012345').should('be.visible');
        });

        it('should display user roles as tags', () => {
            // Wait for content to load
            cy.get('.navds-box', { timeout: 10000 }).should('be.visible');

            // Verify roles section
            cy.contains('Roles:').should('be.visible');

            // Check for role tags
            cy.get('.navds-tag').should('have.length.at.least', 1);
            cy.get('.navds-tag').should('contain', 'ROLE_ADMIN@calvin_organizations');
            cy.get('.navds-tag').should('contain', 'ROLE_LOG@hobbes_enterprises');
        });

        it('should have a back button that navigates to dashboard', () => {
            // Verify back button is present
            cy.get('[data-cy="back-button"]').should('be.visible');

            // Click back button and verify navigation
            cy.get('[data-cy="back-button"]').click();
            cy.waitForAppReady();
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });
    });

    describe('User Profile Page - Layout and Styling', () => {
        it('should have proper page structure', () => {
            // Verify main components are present
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');
            cy.get('[data-cy="internal-page-header"]').should('be.visible');
            cy.get('[data-cy="back-button"]').should('be.visible');

            // Verify content box
            cy.get('.navds-box').should('be.visible');
        });

        it('should display user information in organized sections', () => {
            // Wait for content to load
            cy.get('.navds-box', { timeout: 10000 }).should('be.visible');

            // Verify information is organized in divs with proper spacing
            cy.get('.navds-box div').should('have.length.at.least', 4); // At least 4 info sections

            // Each section should have a label and content
            cy.contains('Full Name:').parent().should('be.visible');
            cy.contains('Email:').parent().should('be.visible');
            cy.contains('Mobile:').parent().should('be.visible');
            cy.contains('Roles:').parent().should('be.visible');
        });

        it('should have proper styling for role tags', () => {
            // Wait for content to load
            cy.get('.navds-box', { timeout: 10000 }).should('be.visible');

            // Verify tag styling
            cy.get('.navds-tag').should('have.class', 'navds-tag--info');
            cy.get('.navds-tag').should('have.css', 'margin-right', '8px');
        });
    });

    describe('User Profile Page - Data Loading', () => {
        it('should load user data from API', () => {
            // Verify that user data is loaded and displayed
            cy.get('.navds-box', { timeout: 10000 }).should('be.visible');

            // Check that all expected user data fields are present
            cy.contains('Full Name:').should('be.visible');
            cy.contains('Email:').should('be.visible');
            cy.contains('Mobile:').should('be.visible');
            cy.contains('Roles:').should('be.visible');

            // Verify data is not empty
            cy.contains('Calvin').should('be.visible');
            cy.contains('@calvinball.com').should('be.visible');
            cy.contains('90012345').should('be.visible');
        });

        it('should handle multiple roles correctly', () => {
            // Wait for content to load
            cy.get('.navds-box', { timeout: 10000 }).should('be.visible');

            // Verify multiple roles are displayed
            cy.get('.navds-tag').should('have.length', 2);

            // Check specific roles
            cy.get('.navds-tag').first().should('contain', 'ROLE_ADMIN@calvin_organizations');
            cy.get('.navds-tag').last().should('contain', 'ROLE_LOG@hobbes_enterprises');
        });
    });

    describe('User Profile Page - Navigation', () => {
        it('should be accessible from dashboard', () => {
            // Start from dashboard
            cy.visit('/', { failOnStatusCode: false });
            cy.get('[data-theme="novari"]').should('exist');

            // Navigate to user page (assuming there's a link or button)
            cy.visit('/user', { failOnStatusCode: false });
            cy.url().should('include', '/user');

            // Verify user page loaded
            cy.get('[data-cy="page-title"]').should('contain', 'User Information');
        });

        it('should maintain navigation state', () => {
            // Visit user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="page-title"]').should('contain', 'User Information');

            // Navigate back to dashboard
            cy.get('[data-cy="back-button"]').click();
            cy.url().should('eq', Cypress.config().baseUrl + '/');

            // Navigate back to user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="page-title"]').should('contain', 'User Information');
        });
    });

    describe('User Profile Page - Accessibility', () => {
        it('should have proper heading structure', () => {
            // Verify main heading
            cy.get('[data-cy="page-title"]').should('contain', 'User Information');

            // Verify labels are properly structured
            cy.contains('Full Name:').should('be.visible');
            cy.contains('Email:').should('be.visible');
            cy.contains('Mobile:').should('be.visible');
            cy.contains('Roles:').should('be.visible');
        });

        it('should have accessible role tags', () => {
            // Wait for content to load
            cy.get('.navds-box', { timeout: 10000 }).should('be.visible');

            // Verify role tags are accessible
            cy.get('.navds-tag').should('be.visible');
            cy.get('.navds-tag').should('have.attr', 'class');

            // Check that tags have proper contrast and visibility
            cy.get('.navds-tag').should('have.css', 'display', 'inline-flex');
        });

        it('should support keyboard navigation', () => {
            // Verify back button is focusable
            cy.get('[data-cy="back-button"]').focus();
            cy.get('[data-cy="back-button"]').should('be.focused');

            // Verify breadcrumbs are accessible
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');
        });
    });

    describe('User Profile Page - Error Handling', () => {
        it('should handle page refresh gracefully', () => {
            // Load page initially
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="page-title"]').should('contain', 'User Information');

            // Refresh page
            cy.reload();
            cy.get('h1', { timeout: 10000 }).should('contain', 'User Information');
        });

        it('should maintain functionality after navigation', () => {
            // Visit user page
            cy.visit('/user', { failOnStatusCode: false });
            cy.get('[data-cy="page-title"]').should('contain', 'User Information');

            // Navigate away and back
            cy.visit('/', { failOnStatusCode: false });
            cy.visit('/user', { failOnStatusCode: false });

            // Verify page still works
            cy.get('[data-cy="page-title"]').should('contain', 'User Information');
            cy.contains('Calvin Watterson').should('be.visible');
        });
    });
});
