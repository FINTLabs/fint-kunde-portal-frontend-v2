import { error, log } from '~/utils/logger';
import {IOrganisations} from "~/api/types";


const API_URL = process.env.API_URL || 'https://kunde-beta.fintlabs.no';

class OrganisationApi {
  static async getTechnicalContacts(organisationName: string): Promise<any> {
    const url = `${API_URL}/api/organisations/${organisationName}/contacts/technical`;
    log('Fetching technical contacts', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
      });
      if (response.redirected) {
        log('Request was redirected:', response.url);
      }
      if (response.ok) {
        return await response.json();
      } else {
        error('Error fetching technical contacts, status:', response.status);
        return null;
      }
    } catch (err) {
      error('Error fetching technical contacts:', err);
      return null;
    }
  }

  static async getLegalContact(organisationName: string): Promise<any> {
    const url = `${API_URL}/api/organisations/${organisationName}/contacts/legal`;
    log('Fetching legal contact', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'x-nin': process.env.PERSONALNUMBER || '',
        },
      });
      if (response.redirected) {
        log('Request was redirected:', response.url);
      }
      if (response.ok) {
        return await response.json();
      } else {
        error('Error fetching legal contact, status:', response.status);
        return null;
      }
    } catch (err) {
      error('Error fetching legal contact:', err);
      return null;
    }
  }

  static async getOrganisation(organisationName: string): Promise<any> {
    const url = `${API_URL}/api/organisations/${organisationName}`;
    log('Fetching organisation details', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
      });
      if (response.redirected) {
        log('Request was redirected:', response.url);
      }
      if (response.ok) {
        return await response.json();
      } else {
        error('Error fetching organisation details, status:', response.status);
        return null;
      }
    } catch (err) {
      error('Error fetching organisation details:', err);
      return null;
    }
  }

  static async linkComponent(component: { name: string }, organisationName: string): Promise<any> {
    const url = `${API_URL}/api/organisations/${organisationName}/components/${component.name}`;
    log('Linking component', url);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ name: component.name }),
      });
      if (response.redirected) {
        log('Request was redirected:', response.url);
      }
      if (response.ok) {
        return await response.json();
      } else {
        error('Error linking component, status:', response.status);
        return null;
      }
    } catch (err) {
      error('Error linking component:', err);
      return null;
    }
  }

  static async unlinkComponent(component: { name: string }, organisationName: string): Promise<any> {
    const url = `${API_URL}/api/organisations/${organisationName}/components/${component.name}`;
    log('Unlinking component', url);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ name: component.name }),
      });
      if (response.redirected) {
        log('Request was redirected:', response.url);
      }
      if (response.ok) {
        return await response.json();
      } else {
        error('Error unlinking component, status:', response.status);
        return null;
      }
    } catch (err) {
      error('Error unlinking component:', err);
      return null;
    }
  }

  static async addTechnicalContact(nin: string, organisationName: string): Promise<any> {
    const url = `${API_URL}/api/organisations/${organisationName}/contacts/technical/${nin}`;
    log('Adding technical contact', url);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ nin }),
      });
      if (response.redirected) {
        log('Request was redirected:', response.url);
      }
      if (response.ok) {
        return await response.json();
      } else {
        error('Error adding technical contact, status:', response.status);
        return null;
      }
    } catch (err) {
      error('Error adding technical contact:', err);
      return null;
    }
  }

  static async removeTechnicalContact(contact: { nin: string }, organisationName: string): Promise<any> {
    const url = `${API_URL}/api/organisations/${organisationName}/contacts/technical/${contact.nin}`;
    log('Removing technical contact', url);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ nin: contact.nin }),
      });
      if (response.redirected) {
        log('Request was redirected:', response.url);
      }
      if (response.ok) {
        return await response.json();
      } else {
        error('Error removing technical contact, status:', response.status);
        return null;
      }
    } catch (err) {
      error('Error removing technical contact:', err);
      return null;
    }
  }

  static async setLegalContact(contact: { nin: string }, organisationName: string): Promise<any> {
    const url = `${API_URL}/api/organisations/${organisationName}/contacts/legal/${contact.nin}`;
    log('Setting legal contact', url);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ name: contact.nin }),
      });
      if (response.redirected) {
        log('Request was redirected:', response.url);
      }
      if (response.ok) {
        return response;
      } else {
        error('Error setting legal contact, status:', response.status);
        return null;
      }
    } catch (err) {
      error('Error setting legal contact:', err);
      return null;
    }
  }

  static async unsetLegalContact(contact: { nin: string }, organisationName: string): Promise<any> {
    const url = `${API_URL}/api/organisations/${organisationName}/contacts/legal/${contact.nin}`;
    log('Unsetting legal contact', url);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ name: contact.nin }),
      });
      if (response.redirected) {
        log('Request was redirected:', response.url);
      }
      if (response.ok) {
        return await response.json();
      } else {
        error('Error unsetting legal contact, status:', response.status);
        return null;
      }
    } catch (err) {
      error('Error unsetting legal contact:', err);
      return null;
    }
  }

  static async getPrimaryAsset(organisation: IOrganisations): Promise<any> {
    const url = `${API_URL}/api/organisations/${organisation.name}/asset/primary`;
    log('Fetching primary asset', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
      });
      if (response.redirected) {
        log('Request was redirected:', response.url);
      }
      if (response.ok) {
        return response;
      } else {
        error('Error fetching primary asset, status:', response.status);
        return null;
      }
    } catch (err) {
      error('Error fetching primary asset:', err);
      return null;
    }
  }
}

export default OrganisationApi;
