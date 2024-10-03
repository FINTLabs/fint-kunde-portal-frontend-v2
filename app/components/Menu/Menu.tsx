import { IUserSession } from '~/types/types';
import { MenuRight } from './MenuRight';
import { MenuLeft } from './MenuLeft';

type MenuType = {
    userSession: IUserSession;
};

export default function Menu({ userSession }: MenuType) {
    if (!userSession) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex justify-between">
            <MenuLeft />
            <MenuRight userSession={userSession} />
        </div>
    );
}
