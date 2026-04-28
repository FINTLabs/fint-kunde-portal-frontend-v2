const nb = {
    translation: {
        root: {
            title: 'FINT Kundeportal',
            appName: 'FINT Kundeportal',
            userIconTitle: 'Brukerprofil',
        },
        language: {
            label: 'Sprak',
            nb: 'Norsk',
            en: 'Engelsk',
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
            searchLabel: 'Sok etter adaptere',
            searchPlaceholder: 'Sok etter navn eller beskrivelse',
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
                shortDescription: 'En komponent er en losning fra FINT.',
                description:
                    'En komponent er en losning fra FINT. For at en organisasjon skal kunne benytte en komponent, ma den forst legges til i organisasjonens oppsett. Komponenter merket som Apne Data/Felles kan ikke legges til, da de administreres sentralt av FINT.',
            },
            adapter: {
                title: 'Adapter',
                shortDescription:
                    'Et adapter er paloggingsinformasjon som benyttes av fagsystem-adaptere.',
                description:
                    'Et adapter er paloggingsinformasjon som benyttes av fagsystem-adaptere for a fa tilgang til en komponent, for eksempel Visma Enterprise eller Unit4 (Evry). For et fagsystem-adapter kan tas i bruk, ma adapteret registreres. Dette innebaerer a opprette paloggingsinformasjon og tildele tilgang til de relevante komponentene som skal handteres. Paloggingsinformasjon og detaljer om endepunkter ma deles med den som skal installere og konfigurere adapteret. For nye tjenester opprettes klienter automatisk, som eliminerer behovet for manuell handtering og utveksling av autentiseringsinformasjon. Disse klientene etableres for a dekke tilgangsbehov i FINTs undersystemer.',
            },
            klienter: {
                title: 'Klienter',
                shortDescription:
                    'En klient er paloggingsinformasjon som brukes av en integrasjon for a fa tilgang til en komponent.',
                description:
                    'En klient er paloggingsinformasjon som brukes av en integrasjon for a fa tilgang til en komponent, for eksempel et IDM-system eller en integrasjonsbuss som BizTalk. For integrasjonen kan tas i bruk, ma klienten registreres. Dette innebaerer a opprette paloggingsinformasjon og tildele tilgang til de relevante komponentene som skal handteres. Paloggingsinformasjon og detaljer om endepunkter ma deles med den som skal installere og konfigurere integrasjonen. For nye tjenester opprettes klienter automatisk, noe som eliminerer behovet for manuell handtering og utveksling av autentiseringsinformasjon. Disse klientene etableres for a dekke tilgangsbehov i FINTs undersystemer.',
            },
            assets: {
                title: 'Ressurser',
                shortDescription:
                    'En ressurs er en identifikator som sikrer at en foresporsel til en komponent rutes til riktig organisasjon.',
                description:
                    'En ressurs er en identifikator som sikrer at en foresporsel til en komponent rutes til riktig organisasjon. Alle adaptere og klienter ma vaere tilknyttet en ressurs. Nar et nytt adapter eller en ny klient opprettes, blir de automatisk koblet til primaerressursen.',
            },
            basistest: {
                title: 'Basistest',
                shortDescription:
                    'En basistest verifiserer at alle deler av FINT-komponenten fungerer som forventet.',
                description:
                    'En basistest verifiserer at alle deler av FINT-komponenten fungerer som forventet. I tillegg sjekker den at cachen inneholder data, og at disse nylig er oppdatert. Basistesten er nyttig ved feilsoking, og det er pakrevd a sende med testresultatet nar man kontakter support.',
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
                shortDescription: 'Samtykke-admin er et verktoy for a administrere samtykkebehandlinger.',
                description:
                    'Nedenfor finner du en oversikt over tilgjengelige tjenester. Klikk pa overskriften for a se hele listen over behandlinger eller legge til en ny behandling. For a legge til en ny tjeneste eller behandlingsgrunnlag, klikker du pa plussikonet.',
            },
            status: {
                title: 'Status Dashboard',
                shortDescription: 'Oversikt over status for alle FINT-komponenter og tjenester.',
                description:
                    'Status Dashboard gir deg en oversikt over status for alle FINT-komponenter og tjenester. Her kan du se hvilke komponenter som fungerer normalt, og hvilke som kan ha problemer. Dashboardet viser ogsa informasjon om siste aktivitet og tilgjengelighet for hver komponent.',
            },
            statusKontrakter: {
                title: 'Status Kontrakter',
                shortDescription: 'Detaljert oversikt over adaptere og deres status.',
                description:
                    'Status Kontrakter viser en detaljert oversikt over alle adaptere og deres navaerende status. Her kan du se heartbeat-status, synkronisering og siste overforing for hver kontrakt.',
            },
            statusHendelser: {
                title: 'Status Hendelser',
                shortDescription: 'Oversikt over hendelser og deres status i FINT-systemet.',
                description:
                    'Status Hendelser gir deg en oversikt over alle hendelser som har skjedd i FINT-systemet. Her kan du se operasjoner, ressurser, status og nar hendelsene ble overfort.',
            },
        },
    },
} as const;

export default nb;
