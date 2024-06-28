import logo from '/images/logo.png';
import { NavLink } from '@remix-run/react';

export const Logo = () => (
    <NavLink to="/" className={'flex items-center'}>
        <img src={logo} width={100} height={50} />
    </NavLink>
);
