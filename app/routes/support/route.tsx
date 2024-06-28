import {
    Alert,
    Button,
    HGrid,
    Radio,
    RadioGroup,
    Select,
    Textarea,
    TextField,
} from '@navikt/ds-react';
import { json, useLoaderData } from '@remix-run/react';
import Breadcrumbs from '~/components/breadcrumbs';
import InternalPageHeader from '~/components/InternalPageHeader';
import { QuestionmarkDiamondIcon } from '@navikt/aksel-icons';
import ZenDeskApi from '~/api/ZenDeskApi';
import ComponentApi from '~/api/ComponentApi';
import { IComponent } from '~/api/types';
import React, { useState } from 'react';

interface LoaderData {
    types: ISupportType[];
    priorities: IPriorityType[];
    components: IComponent[];
}

export const loader = async () => {
    try {
        const [types, priorities, components] = await Promise.all([
            ZenDeskApi.getType(),
            ZenDeskApi.getPriority(),
            ComponentApi.getOrganisationComponents('fintlabs_no'),
        ]);

        return json({ types, priorities, components });
    } catch (error) {
        console.error('Error in loader:', error);
        throw new Response('Failed to load support form data', { status: 500 });
    }
};

export default function Index() {
    const breadcrumbs = [{ name: 'Support', link: '/support' }];
    const { types, priorities, components } = useLoaderData<LoaderData>();

    const [portal, setPortal] = useState<string>('kunde-portal');
    const [selectedType, setSelectedType] = useState<string>(types[0].value);
    const [selectedPriority, setSelectedPriority] = useState<string>(priorities[0].value);

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Opprett support sak'} icon={QuestionmarkDiamondIcon} />

            <form method="post">
                <RadioGroup
                    legend=""
                    name="portal"
                    defaultValue="kunde-portal"
                    onChange={(value) => setPortal(value)}
                    style={{ marginBottom: '1rem' }}>
                    <Radio value="kunde-portal">Kunde Portal</Radio>
                    <Radio value="felleskomponent">Felleskomponent</Radio>
                </RadioGroup>
                <div style={{ marginBottom: '1rem' }}>
                    <Select
                        label="Component"
                        name="component"
                        disabled={portal !== 'felleskomponent'}>
                        <option value="">Select Component</option>
                        {components.map((component, index) => (
                            <option key={index} value={index}>
                                {component.name}
                            </option>
                        ))}
                    </Select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <HGrid gap="6" columns={2} align="start">
                        <Select
                            label="Support Type"
                            name="supportType"
                            onChange={(e) => setSelectedType(e.target.value)}>
                            {types.map((type, index) => (
                                <option key={index} value={type.value}>
                                    {type.name}
                                </option>
                            ))}
                        </Select>
                        <Alert variant="info" style={{ marginBottom: '1rem' }}>
                            {types.find((type) => type.value === selectedType)?.help}
                        </Alert>
                    </HGrid>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <HGrid gap="6" columns={2} align="start">
                        <Select
                            label="Priority"
                            name="priority"
                            onChange={(e) => setSelectedPriority(e.target.value)}>
                            {priorities.map((priority, index) => (
                                <option key={index} value={priority.value}>
                                    {priority.name}
                                </option>
                            ))}
                        </Select>
                        <Alert variant="info" style={{ marginBottom: '1rem' }}>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html:
                                        priorities.find(
                                            (priority) => priority.value === selectedPriority
                                        )?.help || '',
                                }}
                            />
                        </Alert>
                    </HGrid>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <TextField
                        label="Kort Beskrivelse"
                        name="shortDescription"
                        placeholder="Enter a brief description"
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <Textarea
                        label="Beskrivelse"
                        name="description"
                        placeholder="Enter a detailed description"
                    />
                </div>
                <Button type="submit">Submit (not working yet)</Button>
            </form>
        </div>
    );
}
// export function ErrorBoundary() {
//     const error = useRouteError();
//
//     if (isRouteErrorResponse(error)) {
//         return (
//             <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
//                 <Heading level="1" size="large" spacing>
//                     Error
//                 </Heading>
//                 <p>{error.status} {error.statusText}</p>
//                 <p>{error.data}</p>
//             </div>
//         );
//     } else if (error instanceof Error) {
//         return (
//             <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
//                 <Heading level="1" size="large" spacing>
//                     Error
//                 </Heading>
//                 <p>{error.message}</p>
//             </div>
//         );
//     } else {
//         return (
//             <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
//                 <Heading level="1" size="large" spacing>
//                     Error
//                 </Heading>
//                 <p>An unknown error occurred.</p>
//             </div>
//         );
//     }
// }
