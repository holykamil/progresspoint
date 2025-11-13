import { useState, useRef } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { fetchWithAuth } from '@/lib/api';
import './ProfilePictureUpload.css';

interface ProfilePictureUploadProps {
    onClose: () => void;
    onSuccess: (imageUrl: string) => void;
}

export function ProfilePictureUpload({ onClose, onSuccess }: ProfilePictureUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
            setError('Please select a JPG or PNG image');
            return;
        }

        // Validate file size (3MB max)
        const maxSize = 3 * 1024 * 1024; // 3MB in bytes
        if (file.size > maxSize) {
            setError('Image must be under 3MB');
            return;
        }

        setError(null);
        setSelectedFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSave = async () => {
        if (!selectedFile) {
            setError('Please select an image first');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            // Create FormData with the image file
            const formData = new FormData();
            formData.append('image', selectedFile);

            const response = await fetchWithAuth('/api/user/picture', {
                method: 'POST',
                body: formData
                // Don't set Content-Type header - browser will set it with boundary
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload image');
            }

            const data = await response.json();
            onSuccess(data.profileImageUrl);
        } catch (err) {
            console.error('Error uploading profile picture:', err);
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <div className="profile-picture-overlay" onClick={onClose} />
            <div className="profile-picture-upload-container">
                <button className="close-popup-button" onClick={onClose}>
                    <RiCloseFill className="close-icon" />
                </button>

                <h2 className="profile-picture-upload-title">Upload Profile Picture</h2>

                <div className="profile-picture-preview-section">
                    {previewUrl ? (
                        <div className="profile-picture-preview">
                            <img src={previewUrl} alt="Preview" />
                        </div>
                    ) : (
                        <div className="profile-picture-placeholder">
                            <p>No image selected</p>
                            <small>JPG or PNG, max 3MB</small>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                <button
                    className="select-image-button"
                    onClick={handleUploadClick}
                    disabled={isUploading}
                >
                    {selectedFile ? 'Choose Different Image' : 'Choose Image'}
                </button>

                {error && (
                    <div className="profile-picture-error">
                        {error}
                    </div>
                )}

                <div className="profile-picture-actions">
                    <button
                        className="profile-picture-cancel-button"
                        onClick={onClose}
                        disabled={isUploading}
                    >
                        Cancel
                    </button>
                    <button
                        className="profile-picture-save-button"
                        onClick={handleSave}
                        disabled={!selectedFile || isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Save'}
                    </button>
                </div>
            </div>
        </>
    );
}