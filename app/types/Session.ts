import { IFeatureFlag } from '~/types/FeatureFlag';
import { IMeData } from '~/types/Me';
import { IOrganisation } from '~/types/Organisation';
//
// export interface SessionOrganisation {
//     name: string;
//     orgNumber: string;
//     displayName: string;
// }
export interface IUserSession {
    meData: IMeData;
    organizationCount: number;
    selectedOrganization: IOrganisation;
    organizations: IOrganisation[];
    features: IFeatureFlag;
    selectedEnv: 'beta' | 'api' | 'alpha';
}
