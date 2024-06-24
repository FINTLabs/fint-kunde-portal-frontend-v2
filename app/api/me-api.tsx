import {log, error} from "~/utils/logger";

const API_URL = process.env.API_URL || "https://kunde-beta.fintlabs.no";

class MeApi {
    static async fetchMe() {
        log("Fetching me information", `${API_URL}/api/me`);

        try {
            const response = await fetch(`${API_URL}/api/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-nin": process.env.PERSONALNUMBER || "",
                },
            });

            if (response.redirected) {
                log("Me Request was redirected:", response.url);
            }

            if (response.ok) {
                return await response.json();
            } else {
                error("Error fetching display name", response.status);
                return "try-error";
            }
        } catch (err) {
            log(err);
            error("Error fetching display name:", err);
            return "catch-error";
        }
    }


    static async fetchOrganisations() {
        log("Fetching me information", `${API_URL}/api/contacts/organisations`);

        try {
            const response = await fetch(`${API_URL}/api/contacts/organisations`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-nin": process.env.PERSONALNUMBER || "",
                },
            });

            if (response.redirected) {
                log("Organisations Request was redirected:", response.url);
            }

            if (response.ok) {
                return await response.json();
            } else {
                error("Error fetching organisations", response.status);
                return "try-error";
            }
        } catch (err) {
            log(err);
            error("Error fetching organisations:", err);
            return "catch-error";
        }
    }
}
export default MeApi;
