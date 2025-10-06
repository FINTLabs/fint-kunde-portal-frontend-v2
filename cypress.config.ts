import { defineConfig } from 'cypress';

export default defineConfig({
    projectId: '5vw6a8',

    e2e: {
        supportFile: 'cypress/support/e2e.ts',
        chromeWebSecurity: false,
        baseUrl: 'http://localhost:3000',
        // setupNodeEvents(on, config) {
        //   // implement node event listeners here
        // },
        env: {
            VITE_MOCK_CYPRESS: 'true',
        },
        viewportWidth: 1200,
        viewportHeight: 800,
    },

    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
    },
});
