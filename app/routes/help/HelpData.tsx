// app/helpData.ts
export interface HelpDataItem {
    id: string;
    title: string;
    description: string;
}

export const helpData: HelpDataItem[] = [
    {
        id: 'contacts',
        title: 'Juridisk kontakt / Teknisk kontakter',
        description:
            'Kontakter er personer som har tilgang til kundeportalen. En juridisk kontakt er den som ' +
            'har det merkantile ansvaret.Tekniske kontakter er organisasjonens FINT administratorer. De vil få ' +
            'driftsmeldinger tilsendt ved behov. Ordinære driftsmeldinger sendes på epost. Kritiske ' +
            'driftmeldinger sendes på epost og SMS.',
    },
    {
        id: 'components',
        title: 'Komponenter',
        description:
            'En komponent er en løsning fra FINT. For at organisasjonen skal kunne ta i bruk en løsning fra ' +
            'FINT må den legges til organisasjonen. Komponenter som er merket Åpne Data/Felles kan ikke legges til. ' +
            'De administreres av FINT.',
    },
    {
        id: 'adapter',
        title: 'Adapter',
        description:
            'Ett adapter er påloggingsinformasjon som brukes av fagsystem-adapterne for å få tilgang til ' +
            'en komponent. Dette kan f.eks. Visma Enterprise eller Unit4 (Evry). Adaptere må registreres før ' +
            'fagsystem-adapteret kan tas i bruk. Et adapter må få opprettet påloggingsinformasjon og bli gitt ' +
            'tilgang til de komponentene det skal levere data for. Påloggingsinformasjonen og informasjon om ' +
            'endepunkter må oppgis til den som skal installere og konfigurere adapteret. Automatisk opprettede ' +
            'klienter er generert ved oppsett av nye tjenester, eliminerer behovet for manuell håndtering og ' +
            'utveksling av autentiseringsinformasjon. De blir etablert for å møte et tilgangsbehov i et undersystem ' +
            'i FINT.',
    },
    {
        id: 'klienter',
        title: 'Klienter',
        description:
            'En klient er påloggingsinformasjon som brukes av en integrasjon for å få tilgang til en ' +
            'komponent. Dette kan f.eks. være et IDM system, eller en integrasjonsbuss (BizTalk). Klienten må ' +
            'registreres før integrasjonen kan taes i bruk. En integrasjon må få opprettet påloggingsinformasjon og ' +
            'bli gitt tilgang til de komponentene det skal levere data for. Påloggingsinformasjonen og informasjon ' +
            'om endepunkter må oppgis til den som skal installere og konfigurere integrasjonen. Automatisk ' +
            'opprettede klienter er generert ved oppsett av nye tjenester, eliminerer behovet for manuell håndtering ' +
            'og utveksling av autentiseringsinformasjon. De blir etablert for å møte et tilgangsbehov i et ' +
            'undersystem i FINT.',
    },
    {
        id: 'assets',
        title: 'Ressurser',
        description:
            'En ressurs er identifikatoren som styrer en forespørsel mot en komponent til riktig ' +
            'organisasjon. Alle adapter og klienter må være knyttet til en ressurs. Når man lager et nytt ' +
            'adapter eller klient vil disse automatisk bli tilknyttet primærressursen.',
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
            'En basistest undersøker om alle delene i FINT komponenten fungerer som de skal. I tillegg ' +
            'sjekker den om cachen har data og at de nylig ble oppdatert. Dette er greit å kjøre i ' +
            'feilsøkingssammenheng. Det er også et krav å sende med resultatet av denne testen før man ' +
            'kontakter support.',
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
            'Nedenfor er en liste over tjenester. Klikk på overskriften for å se en fullstendig liste ' +
            'over behandlinger eller legg til en ny behandlinger. Klikk på plussikonet for å legge til en ' +
            'nye tjenester eller behandlingsgrunnlag.',
    },
    {
        id: 'hendelseslogg',
        title: 'Hendelseslogg',
        description: 'This needs to be written!!!!',
    },
];
