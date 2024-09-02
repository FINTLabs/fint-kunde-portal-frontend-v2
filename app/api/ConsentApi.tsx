import { log } from '~/utils/logger';
import { request } from '~/api/shared/api';

const API_URL = process.env.CONSENT_API_URL;

class ConsentApi {
    static async getBehandlings(orgName: string) {
        const url = `${API_URL}/consent-admin/behandling/${orgName}`;
        log('url', url);

        return request(url, 'getBehandlings', 'GET', 'json');
    }

    static async getTjenste(orgName: string) {
        const url = `${API_URL}/consent-admin/tjeneste/${orgName}`;
        log('url', url);

        return request(url, 'getTjenste', 'GET', 'json');
    }

    static async getPersonopplysning() {
        const url = `${API_URL}/consent-admin/personopplysning`;
        log('url', url);

        return request(url, 'getPersonopplysning', 'GET', 'json');
    }

    static async getBehandlingsgrunnlag() {
        const url = `${API_URL}/consent-admin/behandlingsgrunnlag`;
        log('url', url);

        return request(url, 'getBehandlingsgrunnlag', 'GET', 'json');
    }

    static setActive(orgName: string, behandlingId: string, isActive: string) {
        const request = new Request(
            `${API_URL}/consent-admin/behandling/${orgName}/${behandlingId}/${isActive}`,
            {
                method: 'PUT',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + process.env.BEARER_TOKEN,
                }),
                credentials: 'same-origin',
            }
        );

        return fetch(request)
            .then((response) => {
                if (response.ok) {
                    return { message: 'Samtykke er oppdatert', variant: 'info' };
                } else {
                    return {
                        message: 'Det oppsto en feil ved oppdatering.',
                        variant: 'error',
                    };
                }
            })
            .catch((error) => {
                error('error setting isActive on samtykke behandling');
                return {
                    message: 'Det oppsto en feil.',
                    variant: 'error',
                };
            });
    }

    static createPolicy(
        serviceId: string,
        reasonId: string,
        personalDataId: string,
        description: string,
        orgName: string
    ) {
        const request = new Request(`/consent-admin/behandling/${orgName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.BEARER_TOKEN,
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                aktiv: true,
                formal: description,
                behandlingsgrunnlagIds: [reasonId],
                tjenesteIds: [serviceId],
                personopplysningIds: [personalDataId],
            }),
        });
        return fetch(request)
            .then((response) => {
                if (response.ok) {
                    return { message: 'Samtykke er added', variant: 'info' };
                } else {
                    return {
                        message: 'Det oppsto en feil ved adding.',
                        variant: 'error',
                    };
                }
            })
            .catch((error) => {
                error('error adding a new samtykke');
                return {
                    message: 'Det oppsto en feil.',
                    variant: 'error',
                };
            });
    }

    static async createService(serviceName: string, orgName: string) {
        console.log('Sending a api request with new service name: ', serviceName);

        const request = new Request(`${API_URL}/consent-admin/tjeneste/${orgName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + process.env.BEARER_TOKEN,
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                navn: serviceName,
            }),
        });

        return fetch(request)
            .then((response) => {
                if (response.ok) {
                    return { message: 'Tjeneste er added', variant: 'info' };
                } else {
                    return {
                        message: 'Det oppsto en feil ved tjeneste: ' + response.statusText,
                        variant: 'error',
                    };
                }
            })
            .catch((error) => {
                error('error adding a new tjeneste');
                return {
                    message: 'Det oppsto en feil.',
                    variant: 'error',
                };
            });
    }
}

export default ConsentApi;
