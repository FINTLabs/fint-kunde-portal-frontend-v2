import React from 'react';
import { Accordion } from '@navikt/ds-react';

interface IService {
    id: string;
    orgId: string;
    navn: string;
    behandlingIds: string[];
}

interface ServiceAccordionProps {
    services: IService[];
}

const ServiceAccordion: React.FC<ServiceAccordionProps> = ({ services }) => {
    return (
        <Accordion>
            {services.map((service) => (
                <Accordion.Item key={service.id}>
                    <Accordion.Header>{service.navn}</Accordion.Header>
                    <Accordion.Content>
                        <p>
                            <strong>Organization ID:</strong> {service.orgId}
                        </p>
                        <p>
                            <strong>Behandling IDs:</strong>{' '}
                            {service.behandlingIds.join(', ') || 'None'}
                        </p>
                        <p>
                            <strong>Service ID:</strong> {service.id}
                        </p>
                    </Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion>
    );
};

export default ServiceAccordion;
