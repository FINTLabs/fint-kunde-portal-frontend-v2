// app/routes/buttonAction.tsx
import { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useActionData, Form, useLoaderData, useSubmit } from '@remix-run/react';
import { json } from '@remix-run/node';
import React from 'react';
import ComponentApi from '~/api/ComponentApi';
import { log } from '~/utils/logger';
import { getSelectedOrganization } from '~/utils/selectedOrganization';
import { IComponent } from '~/types/Component';
import ComponentsTable from '../komponenter._index/ComponentsTable';
import OrganisationApi from '~/api/OrganisationApi';
import { getFormData } from '~/utils/requestUtils';

export const meta: MetaFunction = () => {
    return [
        { title: 'Komponenter' },
        { name: 'description', content: 'Liste over komponenter._index' },
    ];
};
// Action function to handle form submission
export const action: ActionFunction = async ({ request }) => {
    // Simulate some action, e.g., saving data, calling an API, etc.
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    // Simulate success or failure based on action type
    console.log(actionType);
    const isSuccess = actionType === 'success';

    // const actionName = 'action update';
    // const orgName = await getSelectedOrganization(request);

    // let updateType = getFormData(formData.get('updateType'), 'updateType', actionName);
    // const componentName = getFormData(formData.get('componentName'), 'componentName', actionName);
    // console.log(orgName);
    // console.log('skfsdldfl');

    // try {
    //     const response = await OrganisationApi.updateComponent(componentName, orgName, updateType);
    //     const successResponse = response.status === 204;

    //     if (!successResponse) {
    //         log(`${actionName} failed: Response: ${response.status}`);
    //     }
    //     const success = response.status === 204;
    //     const actionDataResult = { success, status: response.status };
    //     console.log(actionDataResult);
    //     return json(actionDataResult);
    // } catch (error) {
    //     console.error('Error updating component:', error);
    //     return json({ success: false, error: 'Error updating component' }, { status: 500 });
    // }

    // Return data back to the client
    return json({ isSuccess });
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

// The component that renders the page
export default function ButtonActionExample() {
    // Use actionData to access the result of the action
    const actionData = useActionData<typeof action>();
    const { components, orgName } = useLoaderData<{ components: IComponent[]; orgName: string }>();
    const selectedCompoents = components
        .filter((component) => component.organisations.some((org) => org.includes(orgName)))
        .map((component) => component.dn);

    const submit = useSubmit();

    console.log('actionData');
    console.log(actionData);

    const handleClick = (actionType: string) => {
        const formData = new FormData();
        formData.append('actionType', actionType);

        submit(formData, { method: 'post' });
    };

    return (
        <div>
            <h1>Button Action Example</h1>

            {/* <Breadcrumbs breadcrumbs={breadcrumbs} /> */}
            {/* <InternalPageHeader title={'Komponenter'} icon={ComponentIcon} helpText="components" /> */}
            <ComponentsTable
                items={components}
                selectedItems={selectedCompoents}
                toggleSwitch={(name, isChecked) => {
                    submit(
                        {
                            componentName: name,
                            updateType: isChecked ? 'add' : 'remove',
                            actionType: 'UPDATE_COMPONENT_IN_ORGANISATION',
                        },
                        {
                            method: 'post',
                            // navigate: false,
                        }
                    );
                }}
            />

            {/* Buttons to trigger the form submission */}
            <button onClick={() => handleClick('success')}>Submit Success</button>
            <br />
            <button onClick={() => handleClick('failure')}>Submit Failure</button>

            {/* Display the result based on actionData */}
            {actionData !== undefined && (
                <div>
                    {actionData.isSuccess ? (
                        <p style={{ color: 'green' }}>Action was successful!</p>
                    ) : (
                        <p style={{ color: 'red' }}>Action failed!</p>
                    )}
                </div>
            )}
        </div>
    );
}
