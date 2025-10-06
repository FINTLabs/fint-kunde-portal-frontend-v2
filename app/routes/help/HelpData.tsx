// app/helpData.ts
export interface HelpDataItem {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
}

export const helpData: HelpDataItem[] = [
    {
        id: 'contacts',
        title: 'Juridisk kontakt / Tekniske kontakter',
        shortDescription: 'Kontakter er personer med tilgang til kundeportalen.',
        description:
            'Kontakter er personer med tilgang til kundeportalen.' +
            'Juridisk kontakt har det overordnede, merkantile ansvaret, og tekniske kontakter fungerer som organisasjonens FINT-administratorer.',
    },
    {
        id: 'components',
        title: 'Komponenter',
        shortDescription: 'En komponent er en løsning fra FINT.',
        description:
            'En komponent er en løsning fra FINT. For at en organisasjon skal kunne benytte en komponent, må den først legges til i organisasjonens oppsett. Komponenter merket som Åpne Data/Felles kan ikke legges til, da de administreres sentralt av FINT.',
    },
    {
        id: 'adapter',
        title: 'Adapter',
        shortDescription: 'Et adapter er påloggingsinformasjon som benyttes av fagsystem-adaptere.',
        description:
            'Et adapter er påloggingsinformasjon som benyttes av fagsystem-adaptere for å få tilgang til en komponent, ' +
            'for eksempel Visma Enterprise eller Unit4 (Evry). Før et fagsystem-adapter kan tas i bruk, må adapteret ' +
            'registreres. Dette innebærer å opprette påloggingsinformasjon og tildele tilgang til de relevante komponentene ' +
            'som skal håndteres. ' +
            'Påloggingsinformasjon og detaljer om endepunkter må deles med den som skal installere og konfigurere ' +
            'adapteret. For nye tjenester opprettes klienter automatisk, som eliminerer behovet for manuell håndtering ' +
            'og utveksling av autentiseringsinformasjon. Disse klientene etableres for å dekke tilgangsbehov i FINTs ' +
            'undersystemer.',
    },
    {
        id: 'klienter',
        title: 'Klienter',
        shortDescription:
            'En klient er påloggingsinformasjon som brukes av en integrasjon for å få tilgang til en komponent.',
        description:
            'En klient er påloggingsinformasjon som brukes av en integrasjon for å få tilgang til en komponent, for ' +
            'eksempel et IDM-system eller en integrasjonsbuss som BizTalk. Før integrasjonen kan tas i bruk, må ' +
            'klienten registreres. Dette innebærer å opprette påloggingsinformasjon og tildele tilgang til de ' +
            'relevante komponentene som skal håndteres. ' +
            ' Påloggingsinformasjon og detaljer om endepunkter må deles med ' +
            'den som skal installere og konfigurere integrasjonen. For nye tjenester opprettes klienter automatisk, ' +
            'noe som eliminerer behovet for manuell håndtering og utveksling av autentiseringsinformasjon. Disse ' +
            'klientene etableres for å dekke tilgangsbehov i FINTs undersystemer.',
    },
    {
        id: 'assets',
        title: 'Ressurser',
        shortDescription:
            'En ressurs er en identifikator som sikrer at en forespørsel til en komponent rutes til riktig organisasjon.',
        description:
            'En ressurs er en identifikator som sikrer at en forespørsel til en komponent rutes til riktig organisasjon. ' +
            'Alle adaptere og klienter må være tilknyttet en ressurs. Når et nytt adapter eller en ny klient opprettes,' +
            ' blir de automatisk koblet til primærressursen.',
    },
    // {
    //     id: 'tilgangspakker',
    //     title: 'Tilgangspakker',
    //     description:
    //         'En tilgangspakke benyttes for å sette opp riktige tilganger til klienter du oppretter i ' +
    //         'kundeportalen. Du kan velge fra pakkeoversikten for å se innholdet i standardpakker eller lage ' +
    //         'en egendefinert tilgangspakke.',
    // },
    {
        id: 'basistest',
        title: 'Basistest',
        shortDescription:
            'En basistest verifiserer at alle deler av FINT-komponenten fungerer som forventet.',
        description:
            'En basistest verifiserer at alle deler av FINT-komponenten fungerer som forventet. I tillegg sjekker den ' +
            'at cachen inneholder data, og at disse nylig er oppdatert. Basistesten er nyttig ved feilsøking, og det er' +
            ' påkrevd å sende med testresultatet når man kontakter support.',
    },
    {
        id: 'relasjonstest',
        title: 'Relasjonstest',
        shortDescription: 'En relasjonstest sjekker at alle relasjonene i en komponent virker.',
        description: 'En relasjonstest sjekker at alle relasjonene i en komponent virker',
    },
    {
        id: 'hendelseslogg',
        title: 'Hendelseslogg',
        shortDescription:
            'Hendelsesloggen viser alle hendelser som har skjedd for en organisasjon.',
        description: '',
    },
    {
        id: 'samtykke',
        title: 'Samtykke',
        shortDescription: 'Samtykke-admin er et verktøy for å administrere samtykkebehandlinger.',
        description:
            'Nedenfor finner du en oversikt over tilgjengelige tjenester. Klikk på overskriften for å se hele listen ' +
            'over behandlinger eller legge til en ny behandling. For å legge til en ny tjeneste eller ' +
            'behandlingsgrunnlag, klikker du på plussikonet.',
    },
    {
        id: 'status',
        title: 'Status Dashboard',
        shortDescription: 'Oversikt over status for alle FINT-komponenter og tjenester.',
        description:
            'Status Dashboard gir deg en oversikt over status for alle FINT-komponenter og tjenester. ' +
            'Her kan du se hvilke komponenter som fungerer normalt, og hvilke som kan ha problemer. ' +
            'Dashboardet viser også informasjon om siste aktivitet og tilgjengelighet for hver komponent.',
    },
    {
        id: 'statusKontrakter',
        title: 'Status Kontrakter',
        shortDescription: 'Detaljert oversikt over adaptere og deres status.',
        description:
            'Status Kontrakter viser en detaljert oversikt over alle adaptere og deres nåværende status. ' +
            'Her kan du se heartbeat-status, synkronisering og siste overføring for hver kontrakt.',
    },
    {
        id: 'statusHendelser',
        title: 'Status Hendelser',
        shortDescription: 'Oversikt over hendelser og deres status i FINT-systemet.',
        description:
            'Status Hendelser gir deg en oversikt over alle hendelser som har skjedd i FINT-systemet. ' +
            'Her kan du se operasjoner, ressurser, status og når hendelsene ble overført.',
    },
];
