import { fetchWithAuth } from './api';
import type { UserData } from '@/types/user';

/**
 * Fetch the current user's profile picture URL
 * @returns The profile picture URL or null if none exists
 */
export async function fetchProfilePicture(): Promise<string | null> {
    try {
        const response = await fetchWithAuth('/api/user/picture');

        if (response.ok) {
            const data = await response.json();
            return data.profileImageUrl;
        } else if (response.status === 404) {
            // No profile picture set, this is expected - return null silently
            return null;
        } else {
            // Other errors (500, etc) should be logged
            console.error('Error fetching profile picture:', response.status);
            return null;
        }
    } catch (err) {
        console.error('Error fetching profile picture:', err);
        return null;
    }
}

/**
 * Fetch the current user's full data including stats
 */
export async function fetchUserData(): Promise<UserData | null> {
    try {
        const response = await fetchWithAuth('/api/me');

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data: UserData = await response.json();
        return data;
    } catch (err) {
        console.error('Error fetching user data:', err);
        return null;
    }
}

/**
 * Upload a new profile picture
 * @param file The image file to upload
 * @returns The new profile picture URL
 */
export async function uploadProfilePicture(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('picture', file);

    const response = await fetchWithAuth('/api/user/picture', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.profileImageUrl;
}

/**
 * Delete the current user's profile picture
 */
export async function deleteProfilePicture(): Promise<void> {
    const response = await fetchWithAuth('/api/user/picture', {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete profile picture');
    }
}

/**
 * Change the current user's username
 * @param newUsername The new username
 */
export async function changeUsername(newUsername: string): Promise<string> {
    const response = await fetchWithAuth('/api/user/username', {
        method: 'PUT',
        body: JSON.stringify({ newUsername }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change username');
    }

    const data = await response.json();
    return data.username;
}

/**
 * Change the current user's password
 * @param oldPassword The current password
 * @param newPassword The new password
 */
export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const response = await fetchWithAuth('/api/user/password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
    }
}
