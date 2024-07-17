export function getRequestParam(value: string | undefined, name: string) {
    if (!value)
        throw new Response(`Failed to update. Invalid ${name} in request params`, { status: 400 });

    return value;
}
export function getFormData(value: FormDataEntryValue | null, name: string, actionName: string) {
    if (!value)
        throw new Response(`Failed in ${actionName}. Invalid ${name} in formData`, {
            status: 400,
        });

    return value;
}
