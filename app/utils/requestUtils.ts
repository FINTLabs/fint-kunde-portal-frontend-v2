export function getRequestParam(value: string | undefined, name: string) {
    if (!value) throw new Response(` Invalid ${name} in request params`, { status: 400 });

    return value;
}
export function getFormData(value: FormDataEntryValue | null, name: string, actionName: string) {
    if (!value)
        console.error(`Failed in ${actionName}. Invalid value '${value}' for ${name} in formData`);

    return value as string;
}
