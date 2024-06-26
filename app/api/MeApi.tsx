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
                error("Error fetching me information", response.status);
                return "try-error";
            }
        } catch (err) {
            log(err);
            error("Error fetching me information:", err);
            // return "catch-error";
            // TODO: REMOVE !! THIS IS JUST FOR STARTUP
            return {
                dn: "test.user",
                nin: "00000000000",
                firstName: "Test",
                lastName:   "User",
                mail: "TEST EMAIL",
                mobile: "000000000",
                technical: [],
                legal: [],
                supportId: "000000000",
                roles: [],
            }
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
            // return "catch-error";
            // TODO: REMOVE !! THIS IS JUST FOR STARTUP
            return [
                {
                    name: "TEST ORG",
                    orgNumber: "000000000",
                    displayName: "Test Organization",
                    components: [],
                    legalContact: "Test Legal Contact",
                    techicalContacts: [],
                    k8sSize: "small",
                    customer: false,
                    primaryAssetId: "000000000",
                    dn: "test.org",
                },
            ]
        }
    }
}
export default MeApi;
