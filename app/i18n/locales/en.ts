const en = {
    translation: {
        root: {
            title: 'FINT Customer Portal',
            appName: 'FINT Customer Portal',
            userIconTitle: 'User profile',
        },
        language: {
            label: 'Language',
            nb: 'Norwegian',
            en: 'English',
        },
        mainRoutes: {
            adaptersIndex: {
                deletedLabel: 'Adapter',
            },
            resourcesIndex: {
                addButton: 'Add resource',
                notFoundTitle: 'Component not found',
                notFoundDescription: 'Could not load component details.',
            },
            resourcesDetails: {
                notFoundTitle: 'Resource not found',
                notFoundDescription: 'Could not load resource.',
            },
            componentDetails: {
                defaultTitle: 'Component',
                detailsHeading: 'Details',
                endpointsHeading: 'Endpoints',
                swaggerHeading: 'Swagger',
                notFoundTitle: 'Component not found',
                notFoundDescription: 'Could not load component details.',
            },
            adapterDetails: {
                errorTitle: 'Error',
                authHeading: 'Authentication',
            },
            basicTest: {
                warningTitle: 'Client password',
                warningDescription:
                    'The password for the client you run the test with will be reset during the test run. We therefore recommend using a dedicated test client.',
                loadingTitle: 'Loading data...',
                errorRunningTest: 'Error running test:',
                testCompleted: 'Test completed:',
                clientLabel: 'Client',
                noClient: 'no client',
                healthResultsHeading: 'Health test results:',
                cacheStatusHeading: 'Cache status:',
            },
            contacts: {
                addButton: 'Add',
                legalContactHeading: 'Legal contact',
                noLegalContact: 'No legal contact found',
            },
            clientsIndex: {
                deletedLabel: 'Client',
                createButton: 'Create client',
                searchLabel: 'Search clients',
                searchPlaceholder: 'Search by name or description',
            },
            clientDetails: {
                defaultTitle: 'Client',
                authHeading: 'Authentication',
                accessControlHeading: 'Access control for components',
                changeLogButton: 'Change log',
                accessLogButton: 'Access log',
                accessLogModalTitle: 'Access log',
                environmentLegend: 'Environment:',
                notEnabledTitle: 'Not enabled',
                notEnabledDescription: 'Access control for components is not enabled',
                setupAccessButton: 'Set up access control',
                notFoundTitle: 'Client not found',
                notFoundDescription: 'Could not load client details.',
            },
            relationTest: {
                warningTitle: 'Warning',
                warningDescription:
                    'The password for the client you run the test with will be reset during the test run. We therefore recommend using a dedicated test client.',
                removeAllButton: 'Remove all tests',
            },
            user: {
                breadcrumb: 'Profile',
                title: 'User information',
                fullNameLabel: 'Full name:',
                emailLabel: 'Email:',
                mobileLabel: 'Mobile:',
                rolesLabel: 'Roles:',
            },
            help: {
                breadcrumb: 'Help',
                title: 'More information',
            },
        },
        footer: {
            incidents: 'Service status',
            support: 'Support Request',
            help: 'User help',
            glossary: 'Glossary',
            testClient: 'FINT Test Client',
        },
        menu: {
            dashboard: 'Dashboard',
            dashboardDescription: 'Overview of all available services',
            access: 'Access',
            contacts: 'Contacts',
            components: 'Components',
            adapters: 'Adapters',
            clients: 'Clients',
            resources: 'Resources',
            health: 'Health',
            eventLog: 'Event log',
            basicTest: 'Basic test',
            relationTest: 'Relation test',
        },
        adapterIndex: {
            pageTitle: 'Adapters',
            metaDescription: 'List of adapters',
            createButton: 'Create adapter',
            searchLabel: 'Search adapters',
            searchPlaceholder: 'Search by name or description',
            emptyState: 'No adapters found',
        },
        home: {
            welcome: 'Welcome to the FINT Customer Portal, {{name}}.',
        },
        help: {
            contacts: {
                title: 'Legal Contact / Technical Contacts',
                shortDescription: 'Contacts are people with access to the customer portal.',
                description:
                    'Contacts are people with access to the customer portal. The legal contact has the overall commercial responsibility, and technical contacts act as the organization FINT administrators.',
            },
            components: {
                title: 'Components',
                shortDescription: 'A component is a solution from FINT.',
                description:
                    'A component is a solution from FINT. For an organization to use a component, it must first be added to the organization configuration. Components marked as Open Data/Common cannot be added because they are centrally managed by FINT.',
            },
            adapter: {
                title: 'Adapter',
                shortDescription: 'An adapter is login information used by system adapters.',
                description:
                    'An adapter is login information used by system adapters to access a component, for example Visma Enterprise or Unit4 (Evry). Before an adapter can be used, it must be registered. This includes creating login credentials and assigning access to relevant components. Login information and endpoint details must be shared with the person responsible for installation and configuration. For new services, clients are created automatically, reducing manual handling and exchange of authentication details. These clients are established to cover access requirements in FINT subsystems.',
            },
            klienter: {
                title: 'Clients',
                shortDescription:
                    'A client is login information used by an integration to access a component.',
                description:
                    'A client is login information used by an integration to access a component, for example an IDM system or an integration bus such as BizTalk. Before the integration can be used, the client must be registered. This includes creating login credentials and assigning access to relevant components. Login information and endpoint details must be shared with the person responsible for installation and configuration. For new services, clients are created automatically, reducing manual handling and exchange of authentication details. These clients are established to cover access requirements in FINT subsystems.',
            },
            assets: {
                title: 'Resources',
                shortDescription:
                    'A resource is an identifier that ensures requests are routed to the correct organization.',
                description:
                    'A resource is an identifier that ensures requests to a component are routed to the correct organization. All adapters and clients must be connected to a resource. When a new adapter or client is created, it is automatically connected to the primary resource.',
            },
            basistest: {
                title: 'Basic Test',
                shortDescription:
                    'A basic test verifies that all parts of the FINT component are working as expected.',
                description:
                    'A basic test verifies that all parts of the FINT component are working as expected. It also checks that the cache contains data and that the data is recently updated. The basic test is useful for troubleshooting, and the test result must be included when contacting support.',
            },
            relasjonstest: {
                title: 'Relation Test',
                shortDescription:
                    'A relation test checks that all relations in a component are working.',
                description: 'A relation test checks that all relations in a component are working.',
            },
            hendelseslogg: {
                title: 'Event Log',
                shortDescription:
                    'The event log shows all events that have happened for an organization.',
                description: '',
            },
            samtykke: {
                title: 'Consent',
                shortDescription: 'Consent admin is a tool for managing consent processing.',
                description:
                    'Below you will find an overview of available services. Click the heading to view the full list of processes or add a new process. To add a new service or legal basis, click the plus icon.',
            },
            status: {
                title: 'Status Dashboard',
                shortDescription: 'Overview of status for all FINT components and services.',
                description:
                    'Status Dashboard gives an overview of status for all FINT components and services. You can see which components are functioning normally and which may have issues. The dashboard also shows information about recent activity and availability for each component.',
            },
            statusKontrakter: {
                title: 'Status Contracts',
                shortDescription: 'Detailed overview of adapters and their status.',
                description:
                    'Status Contracts shows a detailed overview of all adapters and their current status. You can view heartbeat status, synchronization, and latest transfer for each contract.',
            },
            statusHendelser: {
                title: 'Status Events',
                shortDescription: 'Overview of events and their status in the FINT system.',
                description:
                    'Status Events gives an overview of all events that have occurred in the FINT system. You can view operations, resources, status, and when events were transferred.',
            },
        },
    },
} as const;

export default en;
