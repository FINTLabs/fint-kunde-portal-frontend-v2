import AdapterAPI from '~/api/AdapterApi';

const resetPassword = async (setPassord: React.Dispatch<React.SetStateAction<string>>) => {
    console.log('handle reset password and post the password to backend');
    setTimeout(() => {
        setPassord('*******');
    }, 400);
};

const fetchClientSecret = async (name: string, organisationName: string) => {
    return await AdapterAPI.getOpenIdSecret(name, organisationName);
};

export { resetPassword, fetchClientSecret };
