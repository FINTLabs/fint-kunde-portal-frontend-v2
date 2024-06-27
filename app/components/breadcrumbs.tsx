import { Link } from '@remix-run/react';
import { ChevronRightIcon, HouseIcon } from '@navikt/aksel-icons';

interface BreadcrumbItem {
    name: string;
    link: string;
}

interface BreadcrumbsProps {
    breadcrumbs: BreadcrumbItem[];
}

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
    const homeLink = '/';
    const linkStyle = { textDecoration: 'none', display: 'flex', alignItems: 'center' };

    const crumbs = breadcrumbs.map(({ name, link }) => (
        <div key={link} className="flex items-center">
            <ChevronRightIcon title="Spacer" />
            <Link to={link} style={linkStyle}>
                {name}
            </Link>
        </div>
    ));

    return (
        <div className="flex items-center space-x-2 p-3">
            <Link to={homeLink} style={linkStyle}>
                <HouseIcon title="a11y-title" />
                {'Dashboard'}
            </Link>
            {crumbs}
        </div>
    );
}
