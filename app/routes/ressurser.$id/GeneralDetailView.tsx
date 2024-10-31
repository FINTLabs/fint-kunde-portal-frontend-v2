import { Heading, HStack, TextField, VStack } from '@navikt/ds-react';
import React from 'react';
import { IAsset } from '~/types/Asset';
import { LabelValuePanel } from '~/components/shared/LabelValuePanel';

interface TestAddFormProps {
    asset: IAsset;
    onChangeDescription: (value: string) => void;
    isEditing: boolean;
    description: string;
}

export const GeneralDetailView: React.FC<TestAddFormProps> = ({
    asset,
    onChangeDescription,
    isEditing,
    description,
}) => {
    //const [description, setDescription] = useState(asset.description);

    return (
        <VStack gap="3">
            <HStack justify={'space-between'} align={'center'}>
                <Heading align="start" size="medium">
                    Detaljer
                </Heading>
            </HStack>

            <HStack justify={'space-between'} gap="8">
                <VStack gap="6">
                    <LabelValuePanel label="Ressurs Id" value={asset.assetId} />
                    <LabelValuePanel label="Navn" value={asset.name} />
                </VStack>

                <HStack className="w-full" align={'end'} justify={'space-between'}>
                    {isEditing ? (
                        <TextField
                            label="Beskrivelse"
                            size="small"
                            value={description}
                            onChange={(e) => onChangeDescription(e.target.value)}
                        />
                    ) : (
                        <LabelValuePanel label="Beskrivelse" value={asset.description} />
                    )}
                </HStack>
            </HStack>
        </VStack>
    );
};
