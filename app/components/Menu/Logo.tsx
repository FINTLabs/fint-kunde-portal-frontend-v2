import { NavLink } from 'react-router';

interface LogoProps {
    width?: number; // Optional prop to set the logo width
}

export const Logo = ({ width = 150 }: LogoProps) => (
    <NavLink to="/" className="flex items-center">
        <img
            src="/images/logo_new.png"
            width={width}
            height={width * (50 / 150)} // Maintain the aspect ratio based on the width
            alt="Novari Logo"
        />
    </NavLink>
);
