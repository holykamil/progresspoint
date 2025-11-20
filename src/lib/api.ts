export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_token');

    // Clean token to remove any whitespace or newlines
    const cleanToken = token?.trim();

    const headers = new Headers({
        ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
        ...(cleanToken && { 'Authorization': `Bearer ${cleanToken}` }),
    });

    // Merge existing headers if present
    if (options.headers) {
        const existingHeaders = new Headers(options.headers);
        existingHeaders.forEach((value, key) => {
            headers.set(key, value);
        });
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        throw new Error('Authentication expired. Please log in again.');
    }

    return response;
}