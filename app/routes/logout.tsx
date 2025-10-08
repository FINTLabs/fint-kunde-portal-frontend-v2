import { type LoaderFunction, redirect } from 'react-router';

export const loader: LoaderFunction = async () => {


    return redirect('https://idp.felleskomponent.no/nidp/app/logout', {

    });
};

export default function Logout() {
    return null;
}
