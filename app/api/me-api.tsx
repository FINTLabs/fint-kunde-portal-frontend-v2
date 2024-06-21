import { log, error } from '~/utils/logger';

const API_URL = process.env.API_URL || 'https://kunde-beta.fintlabs.no';

class MeApi {
    static async fetchDisplayName(cookies: string) {
        log("Fetching me information", `${API_URL}/api/me`);

        try {
            const response = await fetch(`${API_URL}/api/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'cookie': cookies,
                    'x-nin': '13107329263',
                },
            });

            if (response.redirected) {
                log('Me Request was redirected:', response.url);
            }

            if (response.ok) {
                log("response from me fetch:", response);
                return await response.json();
            } else {
                // Handle error response
                error("Error fetching display name", response.status);
                return "try-error";
            }
        } catch (err) {
            // Handle fetch error
            error("Error fetching display name:", err);
            return "catch-error";
        }
    }
}

export default MeApi;
