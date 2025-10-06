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

describe('Help Route Tests', () => {
    beforeEach(() => {
        // Visit help page and wait for it to load
        // cy.visit('/help', { failOnStatusCode: false }).then(() => {
        //     cy.waitForAppReady();
        // });
        cy.visit('/help', { failOnStatusCode: false });
        // cy.reload();
        cy.waitForAppReady();

        // cy.get('[data-theme="novari"]').should('exist');
        // cy.get('.navds-page').should('be.visible');
    });

    describe('Help Page - Basic Functionality', () => {
        it('should display the correct page title and header', () => {
            // Verify page header
            cy.get('[data-cy="page-title"]').should('contain', 'Mer informasjon');

            // Verify breadcrumbs
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');
            cy.contains('Support').should('be.visible');
        });

        it('should display help accordion with all sections', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Verify accordion structure
            cy.get('.navds-accordion__item').should('have.length.at.least', 10);

            // Check for key help sections
            cy.contains('Juridisk kontakt / Tekniske kontakter').should('be.visible');
            cy.contains('Komponenter').should('be.visible');
            cy.contains('Adapter').should('be.visible');
            cy.contains('Klienter').should('be.visible');
            cy.contains('Ressurser').should('be.visible');
        });

        it.skip('should allow expanding and collapsing accordion items', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Find and click on first accordion header
            cy.get('.navds-accordion__item')
                .first()
                .within(() => {
                    cy.get('.navds-accordion__header').click();
                });

            // Wait for accordion to expand and verify content is visible
            cy.get('.navds-accordion__item')
                .first()
                .within(() => {
                    cy.get('.navds-accordion__content', { timeout: 5000 }).should('be.visible');
                    cy.get('.navds-accordion__content').should(
                        'not.have.class',
                        'navds-accordion__content--closed'
                    );
                    cy.get('.navds-accordion__content').should('contain', 'Kontakter er personer');
                });
        });

        it('should display help content for different sections', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Test contacts section
            cy.contains('Juridisk kontakt / Tekniske kontakter').click();
            cy.get('.navds-accordion__content', { timeout: 5000 }).should('be.visible');
            cy.get('.navds-accordion__content').should('contain', 'kontakt');

            // Test components section
            cy.contains('Komponenter').click();
            cy.get('.navds-accordion__content', { timeout: 5000 }).should('be.visible');
            cy.get('.navds-accordion__content').should('contain', 'komponent');

            // Test adapter section
            cy.contains('Adapter').click();
            cy.get('.navds-accordion__content', { timeout: 5000 }).should('be.visible');
            cy.get('.navds-accordion__content').should('contain', 'adapter');
        });
    });

    describe('Help Page - Accordion Functionality', () => {
        it('should expand multiple accordion items simultaneously', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Expand first item
            cy.get('.navds-accordion__item')
                .first()
                .within(() => {
                    cy.get('.navds-accordion__header').click();
                });

            // Verify first item is expanded
            cy.get('.navds-accordion__item')
                .first()
                .within(() => {
                    cy.get('.navds-accordion__content', { timeout: 5000 }).should('be.visible');
                    cy.get('.navds-accordion__content').should(
                        'not.have.class',
                        'navds-accordion__content--closed'
                    );
                });

            // Expand second item
            cy.get('.navds-accordion__item')
                .eq(1)
                .within(() => {
                    cy.get('.navds-accordion__header').click();
                });

            // Verify second item is expanded
            cy.get('.navds-accordion__item')
                .eq(1)
                .within(() => {
                    cy.get('.navds-accordion__content', { timeout: 5000 }).should('be.visible');
                    cy.get('.navds-accordion__content').should(
                        'not.have.class',
                        'navds-accordion__content--closed'
                    );
                });

            // Verify both are expanded
            cy.get('.navds-accordion__content').should('have.length.at.least', 2);
        });

        it('should allow collapsing expanded accordion items', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Expand an item
            cy.get('.navds-accordion__item')
                .first()
                .within(() => {
                    cy.get('.navds-accordion__header').click();
                });

            // Verify item is expanded
            cy.get('.navds-accordion__item')
                .first()
                .within(() => {
                    cy.get('.navds-accordion__content', { timeout: 5000 }).should('be.visible');
                    cy.get('.navds-accordion__content').should(
                        'not.have.class',
                        'navds-accordion__content--closed'
                    );
                });

            // Collapse the same item
            cy.get('.navds-accordion__item')
                .first()
                .within(() => {
                    cy.get('.navds-accordion__header').click();
                });

            // Verify item is collapsed
            cy.get('.navds-accordion__item')
                .first()
                .within(() => {
                    cy.get('.navds-accordion__content').should('not.be.visible');
                    cy.get('.navds-accordion__content').should(
                        'have.class',
                        'navds-accordion__content--closed'
                    );
                });
        });

        it('should display proper accordion headers with icons', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Verify accordion headers are clickable
            cy.get('.navds-accordion__header').should('have.length.at.least', 10);
            cy.get('.navds-accordion__header').each(($header) => {
                cy.wrap($header).should('be.visible');
                cy.wrap($header).should('not.be.empty');
            });
        });
    });

    describe('Help Page - Content Structure', () => {
        it('should have proper help section organization', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Verify main help categories are present
            const expectedSections = [
                'Juridisk kontakt / Tekniske kontakter',
                'Komponenter',
                'Adapter',
                'Klienter',
                'Ressurser',
                'Basistest',
                'Relasjonstest',
                'Hendelseslogg',
                'Samtykke',
                'Status Dashboard',
            ];

            expectedSections.forEach((section) => {
                cy.contains(section).should('be.visible');
            });
        });

        it('should display detailed descriptions when expanded', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Test contacts section content
            cy.contains('Juridisk kontakt / Tekniske kontakter').click();
            cy.get('.navds-accordion__content', { timeout: 5000 }).should('be.visible');
            cy.get('.navds-accordion__content').should('contain', 'Kontakter er personer');
            cy.get('.navds-accordion__content').should('contain', 'tilgang til kundeportalen');

            // Test components section content
            cy.contains('Komponenter').click();
            cy.get('.navds-accordion__content', { timeout: 5000 }).should('be.visible');
            cy.get('.navds-accordion__content').should('contain', 'komponent');
            cy.get('.navds-accordion__content').should('contain', 'FINT');
        });

        it('should format content with proper paragraphs', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Expand adapter section (has longer content)
            cy.contains('Adapter').click();

            // Wait for content to load and verify content is properly formatted in paragraphs
            cy.get('.navds-accordion__content', { timeout: 5000 }).should('be.visible');
            cy.get('.navds-accordion__content p').should('have.length.at.least', 1);

            // Check that adapter content is present (more flexible text matching)
            cy.get('.navds-accordion__content').should('contain', 'adapter');
            cy.get('.navds-accordion__content').should('contain', 'påloggingsinformasjon');
        });
    });

    describe('Help Page - Layout and Styling', () => {
        it('should have proper page structure', () => {
            // Verify main components are present
            cy.get('[data-cy="breadcrumbs"]').should('be.visible');
            cy.get('[data-cy="internal-page-header"]').should('be.visible');

            // Verify content box
            cy.get('.navds-box').should('be.visible');
            cy.get('.navds-accordion').should('be.visible');
        });

        it('should display accordion with proper styling', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Verify accordion styling
            cy.get('.navds-accordion__item').should('have.length.at.least', 10);
            cy.get('.navds-accordion__header').should('be.visible');

            // Check that headers are styled correctly
            cy.get('.navds-accordion__header').each(($header) => {
                cy.wrap($header).should('have.css', 'cursor', 'pointer');
            });
        });

        it('should have responsive layout', () => {
            // Verify page loads properly
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Test different viewport sizes
            cy.viewport(768, 1024); // Tablet
            cy.get('.navds-accordion').should('be.visible');

            cy.viewport(375, 667); // Mobile
            cy.get('.navds-accordion').should('be.visible');

            cy.viewport(1920, 1080); // Desktop
            cy.get('.navds-accordion').should('be.visible');
        });
    });

    describe('Help Page - Accessibility', () => {
        it('should have proper heading structure', () => {
            // Verify main heading
            cy.get('[data-cy="page-title"]').should('contain', 'Mer informasjon');

            // Verify accordion headers are accessible
            cy.get('.navds-accordion__header').should('have.length.at.least', 10);
        });

        it('should support keyboard navigation for accordion', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Test keyboard navigation on first accordion item
            cy.get('.navds-accordion__item')
                .first()
                .within(() => {
                    cy.get('.navds-accordion__header').focus();
                    cy.get('.navds-accordion__header').should('be.focused');
                });
        });

        it.skip('should have accessible accordion content', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Expand an accordion item
            cy.get('.navds-accordion__item')
                .first()
                .within(() => {
                    cy.get('.navds-accordion__header').click();
                });

            // Verify content is accessible (re-query after click)
            cy.get('.navds-accordion__item')
                .first()
                .within(() => {
                    cy.get('.navds-accordion__content', { timeout: 5000 }).should('be.visible');
                    cy.get('.navds-accordion__content').should(
                        'not.have.class',
                        'navds-accordion__content--closed'
                    );
                    cy.get('.navds-accordion__content p').should('be.visible');
                });
        });
    });

    describe('Help Page - Navigation and Integration', () => {
        it('should be accessible from other pages', () => {
            // Start from dashboard
            // cy.visit('/', { failOnStatusCode: false }).then(() => {
            //     cy.waitForAppReady();
            // });
            cy.visit('/', { failOnStatusCode: false });
            cy.reload();
            cy.waitForAppReady();

            cy.get('[data-theme="novari"]').should('exist');

            // Navigate to help page
            // cy.visit('/help', { failOnStatusCode: false }).then(() => {
            //     cy.waitForAppReady();
            // });
            cy.visit('/help', { failOnStatusCode: false });
            cy.reload();
            cy.waitForAppReady();
            cy.url().should('include', '/help');

            // Verify help page loaded
            cy.get('[data-cy="page-title"]').should('contain', 'Mer informasjon');
        });
    });

    describe('Help Page - Error Handling', () => {
        it('should load all help content properly', () => {
            // Wait for content to load
            cy.get('.navds-accordion', { timeout: 10000 }).should('be.visible');

            // Verify all expected help sections are present
            cy.get('.navds-accordion__item').should('have.length.at.least', 10);

            // Verify no empty content sections
            cy.get('.navds-accordion__header').each(($header) => {
                cy.wrap($header).should('not.be.empty');
            });
        });
    });
});
