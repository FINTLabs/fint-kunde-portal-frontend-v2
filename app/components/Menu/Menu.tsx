import { MenuRight } from './MenuRight';
import { MenuLeft } from './MenuLeft';
import { IUserSession } from '~/types/Session';

type MenuType = {
    userSession: IUserSession;
};

export default function Menu({ userSession }: MenuType) {
    if (!userSession) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex justify-between">
            <MenuLeft userSession={userSession} />
            <MenuRight userSession={userSession} />
        </div>
    );
}
