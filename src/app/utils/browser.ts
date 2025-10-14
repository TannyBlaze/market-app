export function isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function safeAlert(message: string) {
    if (isBrowser()) {
        alert(message);
    } else {
        console.log('ALERT (SSR-safe):', message);
    }
}
