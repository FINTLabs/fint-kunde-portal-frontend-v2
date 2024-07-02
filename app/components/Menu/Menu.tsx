import { UserSession } from '~/types/types';
import { MenuRight } from './MenuRight';
import { MenuLeft } from './MenuLeft';
import React from "react";

type MenuType = {
    userSession: UserSession;
    displaySamtykke: boolean;
};

export default function Menu({ userSession, displaySamtykke }: MenuType) {
    if (!userSession || !displaySamtykke) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex justify-between">
            <MenuLeft displaySamtykke={displaySamtykke} />
            <MenuRight userSession={userSession} />
        </div>
    );
}
