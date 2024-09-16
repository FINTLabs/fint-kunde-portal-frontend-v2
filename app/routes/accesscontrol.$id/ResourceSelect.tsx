import { Select } from '@navikt/ds-react';

const data = [
    { name: 'basisgruppe', path: '/utdanning/elev/basisgruppe' },
    {
        name: 'basisgruppemedlemskap',
        path: '/utdanning/elev/basisgruppemedlemskap',
    },
    { name: 'elev', path: '/utdanning/elev/elev' },
    { name: 'elevforhold', path: '/utdanning/elev/elevforhold' },
    {
        name: 'elevtilrettelegging',
        path: '/utdanning/elev/elevtilrettelegging',
    },
    {
        name: 'kontaktlarergruppe',
        path: '/utdanning/elev/kontaktlarergruppe',
    },
    {
        name: 'kontaktlarergruppemedlemskap',
        path: '/utdanning/elev/kontaktlarergruppemedlemskap',
    },
    { name: 'kontaktperson', path: '/utdanning/elev/kontaktperson' },
    { name: 'medlemskap', path: '/utdanning/elev/medlemskap' },
    { name: 'person', path: '/utdanning/elev/person' },
    { name: 'persongruppe', path: '/utdanning/elev/persongruppe' },
    {
        name: 'persongruppemedlemskap',
        path: '/utdanning/elev/persongruppemedlemskap',
    },
    { name: 'skoleressurs', path: '/utdanning/elev/skoleressurs' },
    {
        name: 'undervisningsforhold',
        path: '/utdanning/elev/undervisningsforhold',
    },
    { name: 'varsel', path: '/utdanning/elev/varsel' },
];

const ResourceSelect = () => {
    return (
        <Select label="Utdanning" size="small">
            <option value="">Load a different resource</option>
            {data.map((item, index) => (
                <option key={index} value={`${item.name}-${item.path}`}>
                    {`${item.name} `}
                </option>
            ))}
        </Select>
    );
};

export default ResourceSelect;
