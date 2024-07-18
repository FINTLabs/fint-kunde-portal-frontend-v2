import { Box, Button, Label } from '@navikt/ds-react';
import { IComponent } from '~/types/Component';
import { log } from '~/utils/logger';

interface ClientComponentProps {
    component: IComponent;
    onClose: () => void;
}

const ClientDetails: React.FC<ClientComponentProps> = ({ component, onClose }) => {
    log('component', component.name);
    return (
        <Box padding="4">
            <Label>Edit stuff?? </Label>
            <Button onClick={onClose}>Close </Button>
        </Box>
    );
};

export default ClientDetails;
