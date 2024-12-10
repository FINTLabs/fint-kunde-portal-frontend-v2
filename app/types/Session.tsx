import { FeatureFlags } from '~/types/FeatureFlag';
import { IOrganisation } from '~/types/Organisation';
import { IMeData } from '~/types/Me';
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
    features: FeatureFlags;
}
