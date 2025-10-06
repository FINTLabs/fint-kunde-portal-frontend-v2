import { http, HttpResponse } from 'msw';

import access from '../../fixtures/access.json';
import accessComponent from '../../fixtures/accessComponent.json';
import accessResourceDetails from '../../fixtures/accessResourceDetails.json';
import fieldAccess from '../../fixtures/fieldAccess.json';
import resourceAccess from '../../fixtures/resourceAccess.json';

const API_URL = process.env.ACCESS_URL;

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
        console.log('GET ACCESS FOR CLIENT/ADAPTER');
        return HttpResponse.json(access);
    }),

    http.get(`${API_URL}/access/jennifer-another-test@adapter.fintlabs.no`, () => {
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
        console.log('GET ACCESS FOR CLIENT/ADAPTER');
        return HttpResponse.json(accessComponent);
    }),

    http.get(`${API_URL}/access/jennifer-test-test@client.fintlabs.no/component`, () => {
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
            console.log('GET RESOURCE ACCESS DETAILS');
            return HttpResponse.json(resourceAccess);
        }
    ),
    http.get(
        `${API_URL}/access/jennifer-another-test@adapter.fintlabs.no/component/administrasjon-fullmakt/resource/string`,
        () => {
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
            console.log('GET RESOURCE ACCESS DETAILS');
            return HttpResponse.json(accessResourceDetails);
        }
    ),
    http.get(
        `${API_URL}/access/jennifer-another-test@adapter.fintlabs.no/component/administrasjon-fullmakt/resource`,
        () => {
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
        `${API_URL}/access/jennifer-test-test@client.fintlabs.no/component/administrasjon-fullmakt/resource/string/field`,
        () => {
            console.log('GET RESOURCE ACCESS DETAILS');
            return HttpResponse.json(fieldAccess);
        }
    ),
    http.get(
        `${API_URL}/access/jennifer-another-test@adapter.fintlabs.no/component/administrasjon-fullmakt/resource/string/field`,
        () => {
            console.log('GET RESOURCE ACCESS DETAILS');
            return HttpResponse.json(fieldAccess);
        }
    ),
];
