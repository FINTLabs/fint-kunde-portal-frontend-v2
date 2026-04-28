const nb = {
    translation: {
        root: {
            title: 'FINT Kundeportal',
            appName: 'FINT Kundeportal',
            userIconTitle: 'Brukerprofil',
        },
        language: {
            label: 'Språk',
            nb: 'Norsk',
            en: 'Engelsk',
        },
        mainRoutes: {
            adaptersIndex: {
                deletedLabel: 'Adapter',
            },
            resourcesIndex: {
                addButton: 'Legg til ressurs',
                notFoundTitle: 'Komponent ikke funnet',
                notFoundDescription: 'Kunne ikke laste komponentdetaljer.',
            },
            resourcesDetails: {
                notFoundTitle: 'Ressursen ikke funnet',
                notFoundDescription: 'Kunne ikke laste ressursen.',
            },
            componentDetails: {
                defaultTitle: 'Komponent',
                detailsHeading: 'Detaljer',
                endpointsHeading: 'Endepunkter',
                swaggerHeading: 'Swagger',
                notFoundTitle: 'Komponent ikke funnet',
                notFoundDescription: 'Kunne ikke laste komponentdetaljer.',
            },
            adapterDetails: {
                errorTitle: 'Feil',
                authHeading: 'Autentisering',
            },
            basicTest: {
                warningTitle: 'Passordet til klienten',
                warningDescription:
                    'Passordet til klienten du kjører testen på, vil bli nullstilt under testkjøringen. Det anbefales derfor å bruke en dedikert klient for testing.',
                loadingTitle: 'Laster inn data...',
                errorRunningTest: 'Feil ved kjøring av test:',
                testCompleted: 'Test fullført:',
                clientLabel: 'Klient',
                noClient: 'ingen klient',
                healthResultsHeading: 'Resultat av helsetest:',
                cacheStatusHeading: 'Cache status:',
            },
            contacts: {
                addButton: 'Legg til',
                legalContactHeading: 'Juridisk kontakt',
                noLegalContact: 'Ingen juridisk kontakt funnet',
            },
            clientsIndex: {
                deletedLabel: 'Klient',
                createButton: 'Opprett klient',
                searchLabel: 'Søk etter klienter',
                searchPlaceholder: 'Søk etter navn eller beskrivelse',
            },
            clientDetails: {
                defaultTitle: 'Klient',
                authHeading: 'Autentisering',
                accessControlHeading: 'Tilgangsstyring for komponenter',
                changeLogButton: 'Endringslogg',
                accessLogButton: 'Tilgangslogg',
                accessLogModalTitle: 'Tilgangslogg',
                environmentLegend: 'Miljø:',
                notEnabledTitle: 'Ikke aktivert',
                notEnabledDescription: 'Tilgangsstyring for komponenter er ikke aktivert',
                setupAccessButton: 'Sett opp tilgangsstyring',
                notFoundTitle: 'Klient ikke funnet',
                notFoundDescription: 'Kunne ikke laste klientdetaljer.',
            },
            relationTest: {
                warningTitle: 'Advarsel',
                warningDescription:
                    'Passordet til klienten du kjører testen på, vil bli nullstilt under testkjøringen. Det anbefales derfor å bruke en dedikert klient for testing.',
                removeAllButton: 'Fjern alle tester',
            },
            user: {
                breadcrumb: 'Profil',
                title: 'Brukerinformasjon',
                fullNameLabel: 'Fullt navn:',
                emailLabel: 'E-post:',
                mobileLabel: 'Mobil:',
                rolesLabel: 'Roller:',
            },
            help: {
                breadcrumb: 'Hjelp',
                title: 'Mer informasjon',
            },
        },
        footer: {
            incidents: 'Driftsmeldinger',
            support: 'Opprett supportsak',
            help: 'Brukerhjelp',
            glossary: 'Ordliste',
            testClient: 'FINT Test Client',
        },
        menu: {
            dashboard: 'Dashboard',
            dashboardDescription: 'Oversikt over alle tilgjengelige tjenester',
            access: 'Tilganger',
            contacts: 'Kontakter',
            components: 'Komponenter',
            adapters: 'Adaptere',
            clients: 'Klienter',
            resources: 'Ressurser',
            health: 'Helse',
            eventLog: 'Hendelseslogg',
            basicTest: 'Basistest',
            relationTest: 'Relasjonstest',
        },
        adapterIndex: {
            pageTitle: 'Adaptere',
            metaDescription: 'Liste over adaptere',
            createButton: 'Opprett adapter',
            searchLabel: 'Søk etter adaptere',
            searchPlaceholder: 'Søk etter navn eller beskrivelse',
            emptyState: 'Det finnes ingen adaptere',
        },
        home: {
            welcome: 'Velkommen til kundeportalen, {{name}}.',
        },
        help: {
            contacts: {
                title: 'Juridisk kontakt / Tekniske kontakter',
                shortDescription: 'Kontakter er personer med tilgang til kundeportalen.',
                description:
                    'Kontakter er personer med tilgang til kundeportalen. Juridisk kontakt har det overordnede, merkantile ansvaret, og tekniske kontakter fungerer som organisasjonens FINT-administratorer.',
            },
            components: {
                title: 'Komponenter',
                shortDescription: 'En komponent er en løsning fra FINT.',
                description:
                    'En komponent er en løsning fra FINT. For at en organisasjon skal kunne benytte en komponent, må den først legges til i organisasjonens oppsett. Komponenter merket som Åpne Data/Felles kan ikke legges til, da de administreres sentralt av FINT.',
            },
            adapter: {
                title: 'Adapter',
                shortDescription:
                    'Et adapter er påloggingsinformasjon som benyttes av fagsystem-adaptere.',
                description:
                    'Et adapter er påloggingsinformasjon som benyttes av fagsystem-adaptere for å få tilgang til en komponent, for eksempel Visma Enterprise eller Unit4 (Evry). For at et fagsystem-adapter skal kunne tas i bruk, må adapteret registreres. Dette innebærer å opprette påloggingsinformasjon og tildele tilgang til de relevante komponentene som skal håndteres. Påloggingsinformasjon og detaljer om endepunkter må deles med den som skal installere og konfigurere adapteret. For nye tjenester opprettes klienter automatisk, som eliminerer behovet for manuell håndtering og utveksling av autentiseringsinformasjon. Disse klientene etableres for å dekke tilgangsbehov i FINTs undersystemer.',
            },
            klienter: {
                title: 'Klienter',
                shortDescription:
                    'En klient er påloggingsinformasjon som brukes av en integrasjon for å få tilgang til en komponent.',
                description:
                    'En klient er påloggingsinformasjon som brukes av en integrasjon for å få tilgang til en komponent, for eksempel et IDM-system eller en integrasjonsbuss som BizTalk. For at integrasjonen skal kunne tas i bruk, må klienten registreres. Dette innebærer å opprette påloggingsinformasjon og tildele tilgang til de relevante komponentene som skal håndteres. Påloggingsinformasjon og detaljer om endepunkter må deles med den som skal installere og konfigurere integrasjonen. For nye tjenester opprettes klienter automatisk, noe som eliminerer behovet for manuell håndtering og utveksling av autentiseringsinformasjon. Disse klientene etableres for å dekke tilgangsbehov i FINTs undersystemer.',
            },
            assets: {
                title: 'Ressurser',
                shortDescription:
                    'En ressurs er en identifikator som sikrer at en forespørsel til en komponent rutes til riktig organisasjon.',
                description:
                    'En ressurs er en identifikator som sikrer at en forespørsel til en komponent rutes til riktig organisasjon. Alle adaptere og klienter må være tilknyttet en ressurs. Når et nytt adapter eller en ny klient opprettes, blir de automatisk koblet til primærressursen.',
            },
            basistest: {
                title: 'Basistest',
                shortDescription:
                    'En basistest verifiserer at alle deler av FINT-komponenten fungerer som forventet.',
                description:
                    'En basistest verifiserer at alle deler av FINT-komponenten fungerer som forventet. I tillegg sjekker den at cachen inneholder data, og at disse nylig er oppdatert. Basistesten er nyttig ved feilsøking, og det er påkrevd å sende med testresultatet når man kontakter support.',
            },
            relasjonstest: {
                title: 'Relasjonstest',
                shortDescription: 'En relasjonstest sjekker at alle relasjonene i en komponent virker.',
                description: 'En relasjonstest sjekker at alle relasjonene i en komponent virker.',
            },
            hendelseslogg: {
                title: 'Hendelseslogg',
                shortDescription:
                    'Hendelsesloggen viser alle hendelser som har skjedd for en organisasjon.',
                description: '',
            },
            samtykke: {
                title: 'Samtykke',
                shortDescription: 'Samtykke-admin er et verktøy for å administrere samtykkebehandlinger.',
                description:
                    'Nedenfor finner du en oversikt over tilgjengelige tjenester. Klikk på overskriften for å se hele listen over behandlinger eller legge til en ny behandling. For å legge til en ny tjeneste eller behandlingsgrunnlag, klikker du på plussikonet.',
            },
            status: {
                title: 'Status Dashboard',
                shortDescription: 'Oversikt over status for alle FINT-komponenter og tjenester.',
                description:
                    'Status Dashboard gir deg en oversikt over status for alle FINT-komponenter og tjenester. Her kan du se hvilke komponenter som fungerer normalt, og hvilke som kan ha problemer. Dashboardet viser også informasjon om siste aktivitet og tilgjengelighet for hver komponent.',
            },
            statusKontrakter: {
                title: 'Status Kontrakter',
                shortDescription: 'Detaljert oversikt over adaptere og deres status.',
                description:
                    'Status Kontrakter viser en detaljert oversikt over alle adaptere og deres nåværende status. Her kan du se heartbeat-status, synkronisering og siste overføring for hver kontrakt.',
            },
            statusHendelser: {
                title: 'Status Hendelser',
                shortDescription: 'Oversikt over hendelser og deres status i FINT-systemet.',
                description:
                    'Status Hendelser gir deg en oversikt over alle hendelser som har skjedd i FINT-systemet. Her kan du se operasjoner, ressurser, status og når hendelsene ble overført.',
            },
        },
    },
} as const;

export default nb;
