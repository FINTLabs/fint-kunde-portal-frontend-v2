import { IUserSession } from '~/types/types';
import { MenuRight } from './MenuRight';
import { MenuLeft } from './MenuLeft';

type MenuType = {
    userSession: IUserSession;
    displaySamtykke: boolean;
};

export default function Menu({ userSession, displaySamtykke }: MenuType) {
    if (!userSession || !displaySamtykke) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex justify-between">
            <MenuLeft />
            <MenuRight userSession={userSession} />
        </div>
    );
}
