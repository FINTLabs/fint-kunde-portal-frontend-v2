// src/routes/accesscontrol.$id/AccessTemplateDetails.tsx

import React from 'react';
import { IAccess } from '~/types/Access';

interface AccessTemplateDetailsProps {
    template: IAccess;
}

const AccessTemplateDetails: React.FC<AccessTemplateDetailsProps> = ({ template }) => {
    return (
        <div>
            <h1>{template.name}</h1>
            <p>{template.description}</p>

            <h2>Collection</h2>
            <ul>
                {template.collection.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <h2>Read</h2>
            <ul>
                {template.read.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <h2>Modify</h2>
            <ul>
                {template.modify.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <h2>Clients</h2>
            <ul>
                {template.clients.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <h2>Components</h2>
            <ul>
                {template.components.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default AccessTemplateDetails;
