import React from 'react';

export type MenuItem = {
    title: string;
    path: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    role?: string;
};
