export function isClientSide() {
    return typeof window !== 'undefined';
}

export function isServerSide() {
    return typeof window === 'undefined';
}
