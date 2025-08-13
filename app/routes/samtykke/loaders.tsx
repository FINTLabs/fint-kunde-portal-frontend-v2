import { getSelectedOrganization } from '~/utils/selectedOrganization';
import FeaturesApi from '~/api/FeaturesApi';
import logger from '~/utils/logger';
import ConsentApi from '~/api/ConsentApi';

export const loader = async ({ request }: { request: Request }) => {
    const orgName = await getSelectedOrganization(request);
    const featuresResponse = await FeaturesApi.fetchFeatures();
    const features = featuresResponse?.data;

    logger.debug('RUNNING LOADER IN CONSENT');

    if (features && features['samtykke-admin-new']) {
        const policies = await ConsentApi.getBehandlings(orgName);
        const services = await ConsentApi.getTjenste(orgName);
        const personalDataList = await ConsentApi.getPersonopplysning();
        const foundations = await ConsentApi.getBehandlingsgrunnlag();

        return Response.json({
            policies: policies.data,
            services: services.data,
            personalDataList: personalDataList.data,
            foundations: foundations.data,
        });
    }
};
