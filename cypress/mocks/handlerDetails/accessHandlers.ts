import { http, HttpResponse } from 'msw';

import access from '../../fixtures/access.json';
import accessComponent from '../../fixtures/accessComponent.json';
import accessResourceDetails from '../../fixtures/accessResourceDetails.json';
import accessAudit from '../../fixtures/accessAudit.json';
import fieldAccess from '../../fixtures/fieldAccess.json';
import resourceAccess from '../../fixtures/resourceAccess.json';
import { ACCESS_URL } from '../mockConfig';

const API_URL = ACCESS_URL;

export const accessHandlers = [
    //***** /access/{username}

    /*
        {
          "username": "string",
          "isAdapter": true,
          "environments": {
            "api": true,
            "beta": true,
            "alpha": true,
            "pwf": true
          }
        }
    */

    http.get(`${API_URL}/access/jennifer-test-test@client.fintlabs.no`, () => {
        // eslint-disable-next-line no-console
        console.log('GET ACCESS FOR CLIENT/ADAPTER');
        return HttpResponse.json(access);
    }),

    http.get(`${API_URL}/access/jennifer-another-test@adapter.fintlabs.no`, () => {
        // eslint-disable-next-line no-console
        console.log('GET ACCESS FOR CLIENT/ADAPTER');
        return HttpResponse.json(access);
    }),

    // ***** /access/{username}/component

    /*
        [
          {
            "domain": "string",
            "packages": [
              {
                "packageName": "string",
                "access": true
              }
            ]
          }
        ]
     */
    http.get(`${API_URL}/access/jennifer-another-test@adapter.fintlabs.no/component`, () => {
        // eslint-disable-next-line no-console
        console.log('GET ACCESS FOR CLIENT/ADAPTER');
        return HttpResponse.json(accessComponent);
    }),

    http.get(`${API_URL}/access/jennifer-test-test@client.fintlabs.no/component`, () => {
        // eslint-disable-next-line no-console
        console.log('GET ACCESS FOR CLIENT/ADAPTER');
        return HttpResponse.json(accessComponent);
    }),

    //***** /access/{username}/component/{component}/resource/{resource}

    /*
        {
          "name": "string",
          "enabled": true,
          "writeable": true,
          "readingOption": "SINGULAR"
        }
     */

    http.get(
        `${API_URL}/access/jennifer-test-test@client.fintlabs.no/component/administrasjon-fullmakt/resource/string`,
        () => {
            // eslint-disable-next-line no-console
            console.log('GET RESOURCE ACCESS DETAILS');
            return HttpResponse.json(resourceAccess);
        }
    ),
    http.get(
        `${API_URL}/access/jennifer-another-test@adapter.fintlabs.no/component/administrasjon-fullmakt/resource/string`,
        () => {
            // eslint-disable-next-line no-console
            console.log('GET RESOURCE ACCESS DETAILS');
            return HttpResponse.json(resourceAccess);
        }
    ),

    // ***** /access/{username}/component/{component}/resource

    /*
        [
          {
            "name": "string",
            "enabled": true,
            "writeable": true,
            "readingOption": "SINGULAR"
          }
        ]
     */
    http.get(
        `${API_URL}/access/jennifer-test-test@client.fintlabs.no/component/administrasjon-fullmakt/resource`,
        () => {
            // eslint-disable-next-line no-console
            console.log('GET RESOURCE ACCESS DETAILS');
            return HttpResponse.json(accessResourceDetails);
        }
    ),
    http.get(
        `${API_URL}/access/jennifer-another-test@adapter.fintlabs.no/component/administrasjon-fullmakt/resource`,
        () => {
            // eslint-disable-next-line no-console
            console.log('GET RESOURCE ACCESS DETAILS');
            return HttpResponse.json(accessResourceDetails);
        }
    ),

    // ***** /access/{username}/component/{component}/resource/{resource}/field

    /*
        [
          {
            "name": "string",
            "enabled": true,
            "mustContain": "string",
            "relation": true
          }
        ]

     */

    http.get(
        `${API_URL}/access/jennifer-test-test@client.fintlabs.no/component/administrasjon-fullmakt/Aktivitet`,
        () => {
            // eslint-disable-next-line no-console
            console.log('GET RESOURCE ACCESS DETAILS');
            return HttpResponse.json(fieldAccess);
        }
    ),
    http.get(
        `${API_URL}/access/jennifer-test-test@client.fintlabs.no/component/administrasjon-fullmakt/resource/Aktivitet/field`,
        () => {
            // eslint-disable-next-line no-console
            console.log('GET FIELD  DETAILS handler');
            return HttpResponse.json(fieldAccess);
        }
    ),
    http.get(
        `${API_URL}/access/jennifer-test-test@client.fintlabs.no/component/administrasjon-fullmakt/resource/Aktivitet`,
        () => {
            // eslint-disable-next-line no-console
            console.log('GET resource  DETAILS handler');
            return HttpResponse.json(resourceAccess);
        }
    ),
    // ***** /access/{username}/audit

    /*
        {
          "userName": "string",
          "auditRecord": [
            {
              "portalUser": "string",
              "timeStamp": 0,
              "changes": {
                "changed": "RESOURCE",
                "name": "string",
                "setTo": true
              }
            }
          ]
        }
     */

    http.get(`${API_URL}/access/jennifer-test-test@client.fintlabs.no/audit`, () => {
        // eslint-disable-next-line no-console
        console.log('GET AUDIT LOG');
        return HttpResponse.json(accessAudit);
    }),
];
