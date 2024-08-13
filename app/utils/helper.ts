export function getComponentIds(list: string[]) {
    return list.map((a) => {
        const match = a.match(/ou=([^,]+)/);
        return match ? match[1] : '';
    });
}
