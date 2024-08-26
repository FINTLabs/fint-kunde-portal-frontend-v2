import logo from '/images/logo_new.png';
import { NavLink } from '@remix-run/react';

export const Logo = () => (
    <NavLink to="/" className={'flex items-center'}>
        <img src={logo} width={100} height={50} alt={'Novari Logo'} />
    </NavLink>
);
