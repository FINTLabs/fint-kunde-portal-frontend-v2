import { API_URL } from '~/api/constants';
import { request } from '~/api/shared/api';

class ComponentConfigApi {
    // static getEntities() {
    //     const url = "/api/components/configurations";
    //
    //     return fetch(url, {
    //         method: 'GET',
    //         credentials: 'same-origin',
    //     })
    //         .then(response => Promise.all([response, response.json()]));
    // }

    static async getComponentConfigs() {
        const functionName = 'getComponentConfigs';
        const URL = `${API_URL}/api/components/configurations`;
        return await request(URL, functionName);
    }

    // static async getComponentConfig(componentName: string) {
    //     return this.getComponentConfigs()
    //         .then((configs: IComponentConfig[]) => {
    //             const config = configs.find((item) => item.name === componentName);
    //             if (config) {
    //                 return config;
    //             } else {
    //                 console.error('Component configs not found, componentName:', componentName);
    //                 return null;
    //             }
    //         })
    //         .catch((err) => {
    //             console.error('Error fetching component configs:', err);
    //             return null;
    //         });
    // }
}

export default ComponentConfigApi;
