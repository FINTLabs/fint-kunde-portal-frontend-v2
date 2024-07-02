import { UserSession } from '~/types/types';
import { MenuRight } from './MenuRight';
import { MenuLeft } from './MenuLeft';

type MenuType = {
    userSession: UserSession;
    displaySamtykke: boolean;
};

export default function Menu({ userSession, displaySamtykke }: MenuType) {
    return (
        <div className="flex justify-between">
            <MenuLeft displaySamtykke={displaySamtykke} />
            <MenuRight userSession={userSession} />
        </div>
    );
}
