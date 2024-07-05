import { isClientSide } from '~/utils/environment';

export const API_URL = isClientSide()
    ? process.env.PUBLIC_API_URL
    : process.env.API_URL || 'https://kunde-beta.fintlabs.no';
