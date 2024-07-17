import { Button } from '@navikt/ds-react';
import { PencilIcon, FloppydiskIcon } from '@navikt/aksel-icons';

export function ToggleEditSaveButton({
    isEditing,
    onClick,
}: {
    isEditing: boolean;
    onClick: () => void;
}) {
    return (
        <Button
            icon={isEditing ? <FloppydiskIcon title="Lagre" /> : <PencilIcon title="Rediger" />}
            variant="tertiary"
            type="submit"
            onClick={onClick}
        />
    );
}
