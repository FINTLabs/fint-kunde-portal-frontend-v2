export function getRequestParam(value: string | undefined, name: string) {
    if (!value) throw new Response(` Invalid ${name} in request params`, { status: 400 });

    return value;
}
export function getFormData(value: FormDataEntryValue | null, name: string, actionName: string) {
    if (!value) {
        const errorMessage = `Failed in ${actionName}. ${name} is '${value}' in formData`;
        throw new Response(errorMessage, { status: 400 });
    }

    return value as string;
}
