import AdapterAPI from '~/api/AdapterApi';

const resetPassword = async (setPassord: React.Dispatch<React.SetStateAction<string>>) => {
    console.log('handle reset password and post the password to backend');
    setTimeout(() => {
        setPassord('*******');
    }, 400);
};

const fetchClientSecret = async (
    name: string,
    organisationName: string,
    setClientSecret: React.Dispatch<React.SetStateAction<string>>
) => {
    console.log('name');
    console.log(name);
    setClientSecret('refreshed');
    const secret = await AdapterAPI.getOpenIdSecret(name, organisationName);
    console.log(secret);
    if (secret) {
        setClientSecret(secret);
    }
};

const deleteAdapter = async (name: string, organisationName: string) => {
    // delete
};

export { resetPassword, fetchClientSecret, deleteAdapter };
