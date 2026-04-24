import { ChevronRightIcon, HouseIcon } from '@navikt/aksel-icons';
import { useLocation } from 'react-router';
import { BodyShort, HStack, Link } from '@navikt/ds-react';

interface BreadcrumbItem {
    name: string;
    link: string;
}

interface BreadcrumbsProps {
    breadcrumbs: BreadcrumbItem[];
}

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
    const homeLink = '/';
    const location = useLocation();
    const currentPath = location.pathname;
    const currentPathEncoded = decodeURIComponent(currentPath);

    return (
        <HStack gap="space-2" paddingBlock="space-8" align="center">
            <Link href={homeLink} className="flex items-center gap-1 no-underline">
                <HouseIcon fontSize="1.2rem" />
                <BodyShort size="small" as="span">
                    Dashboard
                </BodyShort>
            </Link>

            {breadcrumbs.map(({ name, link }) => (
                <HStack key={name} gap="space-2" align="center">
                    <ChevronRightIcon fontSize="1rem" />

                    {link === '' || link === currentPath || link == currentPathEncoded ? (
                        <BodyShort size="small" as="span">
                            {name}
                        </BodyShort>
                    ) : (
                        <Link href={link} className="no-underline">
                            <BodyShort size="small" as="span">
                                {name}
                            </BodyShort>
                        </Link>
                    )}
                </HStack>
            ))}
        </HStack>
    );
}
