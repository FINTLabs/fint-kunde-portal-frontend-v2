import { ActionFunctionArgs, type LoaderFunction, MetaFunction } from '@remix-run/node';
import { ComponentIcon } from '@navikt/aksel-icons';
import React, { useEffect, useState } from 'react';
import { json, useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import ComponentApi from '~/api/ComponentApi';
import Breadcrumbs from '~/components/shared/breadcrumbs';
import InternalPageHeader from '~/components/shared/InternalPageHeader';
import ComponentsTable from '~/routes/komponenter._index/ComponentsTable';
import { IComponent } from '~/types/Component';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { getFormData } from '~/utils/requestUtils';
import OrganisationApi from '~/api/OrganisationApi';
import { log } from '~/utils/logger';

export const meta: MetaFunction = () => {
    return [
        { title: 'Komponenter' },
        { name: 'description', content: 'Liste over komponenter._index' },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    log('Calling loader in komponenter_index.tsx');

    try {
        const components = await ComponentApi.getAllComponents();
        const orgName = await getSelectedOrganization(request);
        return json({ components, orgName });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Response('Not Found', { status: 404 });
    }
};

type ActionData = {
    success: boolean;
    status: number;
};

export default function Index() {
    const breadcrumbs = [{ name: 'Komponenter', link: '/komponenter' }];
    const { components, orgName } = useLoaderData<{ components: IComponent[]; orgName: string }>();
    const actionData = useActionData<ActionData>();

    console.log('actionData: ', actionData);
    // console.log(components.length);
    console.log(orgName);
    // console.log(components.map((c) => c.organisations.map((o) => o)));
    const selectedCompoents = components
        .filter((component) => component.organisations.some((org) => org.includes(orgName)))
        .map((component) => component.dn);

    const submit = useSubmit();

    return (
        <>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <InternalPageHeader title={'Komponenter'} icon={ComponentIcon} helpText="components" />
            <ComponentsTable
                items={components}
                selectedItems={selectedCompoents}
                toggleSwitch={(name, isChecked) => {
                    submit(
                        {
                            componentName: name,
                            updateType: isChecked ? 'add' : 'remove',
                        },
                        {
                            method: 'POST',
                            navigate: false,
                        }
                    );
                }}
            />
            {/*<ComponentsTableFlat components={components} selectedComponents={selectedCompoents} />*/}
        </>
    );
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const actionName = 'action update';
    const formData = await request.formData();
    const orgName = await getSelectedOrganization(request);

    let updateType = getFormData(formData.get('updateType'), 'updateType', actionName);
    const componentName = getFormData(formData.get('componentName'), 'componentName', actionName);
    console.log(orgName);
    console.log('skfsdldfl');

    try {
        const response = await OrganisationApi.updateComponent(componentName, orgName, updateType);
        const successResponse = response.status === 204;

        if (!successResponse) {
            log(`${actionName} failed: Response: ${response.status}`);
        }
        const success = response.status === 204;
        const actionDataResult: ActionData = { success, status: response.status };
        console.log(actionDataResult);
        return json({ result: actionDataResult });
    } catch (error) {
        console.error('Error updating component:', error);
        return json({ success: false, error: 'Error updating component' }, { status: 500 });
    }
};
