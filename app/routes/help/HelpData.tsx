// app/helpData.ts
export interface HelpDataItem {
    id: string;
    title: string;
    description: string;
}

export const helpData: HelpDataItem[] = [
    {
        id: 'contacts',
        title: 'Juridisk kontakt / Tekniske kontakter',
        description:
            'Kontakter er personer med tilgang til kundeportalen. Juridisk kontakt har det overordnede, merkantile ansvaret, og tekniske kontakter fungerer som organisasjonens FINT-administratorer.',
    },
    {
        id: 'components',
        title: 'Komponenter',
        description:
            'En komponent er en løsning fra FINT. For at en organisasjon skal kunne benytte en komponent, må den først legges til i organisasjonens oppsett. Komponenter merket som Åpne Data/Felles kan ikke legges til, da de administreres sentralt av FINT.',
    },
    {
        id: 'adapter',
        title: 'Adapter',
        description:
            'Et adapter er påloggingsinformasjon som benyttes av fagsystem-adaptere for å få tilgang til en komponent, ' +
            'for eksempel Visma Enterprise eller Unit4 (Evry). Før et fagsystem-adapter kan tas i bruk, må adapteret ' +
            'registreres. Dette innebærer å opprette påloggingsinformasjon og tildele tilgang til de relevante komponentene ' +
            'som skal håndteres. LINE_BREAK_HERE' +
            'Påloggingsinformasjon og detaljer om endepunkter må deles med den som skal installere og konfigurere ' +
            'adapteret. For nye tjenester opprettes klienter automatisk, som eliminerer behovet for manuell håndtering ' +
            'og utveksling av autentiseringsinformasjon. Disse klientene etableres for å dekke tilgangsbehov i FINTs ' +
            'undersystemer.',
    },
    {
        id: 'klienter',
        title: 'Klienter',
        description:
            'En klient er påloggingsinformasjon som brukes av en integrasjon for å få tilgang til en komponent, for ' +
            'eksempel et IDM-system eller en integrasjonsbuss som BizTalk. Før integrasjonen kan tas i bruk, må ' +
            'klienten registreres. Dette innebærer å opprette påloggingsinformasjon og tildele tilgang til de ' +
            'relevante komponentene som skal håndteres. LINE_BREAK_HERE' +
            ' Påloggingsinformasjon og detaljer om endepunkter må deles med ' +
            'den som skal installere og konfigurere integrasjonen. For nye tjenester opprettes klienter automatisk, ' +
            'noe som eliminerer behovet for manuell håndtering og utveksling av autentiseringsinformasjon. Disse ' +
            'klientene etableres for å dekke tilgangsbehov i FINTs undersystemer.',
    },
    {
        id: 'assets',
        title: 'Ressurser',
        description:
            'En ressurs er en identifikator som sikrer at en forespørsel til en komponent rutes til riktig organisasjon. ' +
            'Alle adaptere og klienter må være tilknyttet en ressurs. Når et nytt adapter eller en ny klient opprettes,' +
            ' blir de automatisk koblet til primærressursen.',
    },
    {
        id: 'tilgangspakker',
        title: 'Tilgangspakker',
        description:
            'En tilgangspakke benyttes for å sette opp riktige tilganger til klienter du oppretter i ' +
            'kundeportalen. Du kan velge fra pakkeoversikten for å se innholdet i standardpakker eller lage ' +
            'en egendefinert tilgangspakke.',
    },
    {
        id: 'basistest',
        title: 'Basistest',
        description:
            'En relasjonstest verifiserer at alle relasjoner i en komponent fungerer som forventet.',
    },
    {
        id: 'relasjonstest',
        title: 'Relasjonstest',
        description: 'En relasjonstest sjekker at alle relasjonene i en komponent virker',
    },
    {
        id: 'hendelseslogg',
        title: 'Hendelseslogg',
        description: 'This needs to be written!!!!',
    },
    {
        id: 'samtykke',
        title: 'Samtykke',
        description:
            'Nedenfor finner du en oversikt over tilgjengelige tjenester. Klikk på overskriften for å se hele listen ' +
            'over behandlinger eller legge til en ny behandling. For å legge til en ny tjeneste eller ' +
            'behandlingsgrunnlag, klikker du på plussikonet.',
    },
];
