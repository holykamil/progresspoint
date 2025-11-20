import { Header } from '@/components/Header/Header';
import { NavLink } from "react-router-dom";
import { RiCloseFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { fetchUserData, fetchProfilePicture } from '@/lib/userApi';
import { ChangeUsername } from '@/components/settings/ChangeUsername/ChangeUsername';
import { ChangePassword } from '@/components/settings/ChangePassword/ChangePassword';
import { ProfilePictureUpload } from '@/components/settings/ProfilePicture/ProfilePictureUpload';
import { ProfilePictureDelete } from '@/components/settings/ProfilePicture/ProfilePictureDelete';
import type { SettingsUserData } from '@/types/user';
import DefaultUserImage from '../../assets/images/account-logo.png';
import './Settings.css';

export function SettingsPage() {
    const [userData, setUserData] = useState<SettingsUserData | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [isUsernamePopupOpen, setIsUsernamePopupOpen] = useState(false);
    const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
    const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        loadUserData();
        loadProfilePicture();
    }, []);

    // Clear success message after 5 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    async function loadUserData() {
        const data = await fetchUserData();
        if (data) {
            // Extract only the user data needed for settings page
            setUserData({ user: data.user });
        }
    }

    async function loadProfilePicture() {
        const imageUrl = await fetchProfilePicture();
        setProfileImageUrl(imageUrl);
    }

    function handleUsernameSuccess(newUsername: string) {
        if (userData) {
            setUserData({
                ...userData,
                user: {
                    ...userData.user,
                    username: newUsername
                }
            });
        }
        setIsUsernamePopupOpen(false);
        setSuccessMessage('Username changed successfully!');
    }

    function handlePasswordSuccess() {
        setIsPasswordPopupOpen(false);
        setSuccessMessage('Password changed successfully!');
    }

    function handleUploadSuccess(imageUrl: string) {
        setProfileImageUrl(imageUrl);
        setIsUploadPopupOpen(false);
        setSuccessMessage('Profile picture uploaded successfully!');
    }

    function handleDeleteSuccess() {
        setProfileImageUrl(null);
        setIsDeletePopupOpen(false);
        setSuccessMessage('Profile picture deleted successfully!');
    }

    // Determine which image to display
    const displayImage = profileImageUrl || DefaultUserImage;

    return (
        <main className="settings-page">
            <Header />
            <div className="settings-page-content">
                <div className='settings-dashboard'>
                    <NavLink className='exit-settings-button' to='/user'>
                        <RiCloseFill className='exit-settings-icon' />
                    </NavLink>
                    <h1 className='settings-header'>Settings</h1>

                    {successMessage && (
                        <div className="settings-success-message">
                            {successMessage}
                        </div>
                    )}

                    <div className='picture-row'>
                        <div className='profile-picture-container'>
                            <img
                                className='settings-profile-picture'
                                src={displayImage}
                                alt="User profile"
                            />
                        </div>
                        <div className="picture-general-info-container">
                            <p className="picture-header">Profile picture</p>
                            <p className="picture-info">PNG, JPG under 3MB</p>
                        </div>
                        <button
                            className='upload-profile-picture-button'
                            onClick={() => setIsUploadPopupOpen(true)}
                        >
                            Upload new picture
                        </button>
                        <button
                            className='delete-profile-picture-button'
                            onClick={() => setIsDeletePopupOpen(true)}
                            disabled={!profileImageUrl}
                        >
                            Delete
                        </button>
                    </div>

                    <div className='username-row'>
                        <p className='username-row-title'>username:</p>
                        <p className='username'>{userData?.user.username || 'Loading...'}</p>
                        <button
                            className='change-username-button'
                            onClick={() => setIsUsernamePopupOpen(true)}
                        >
                            Change
                        </button>
                    </div>

                    <div className='email-row'>
                        <p className='email-row-title'>e-mail:</p>
                        <p className='userEmail'>{userData?.user.email || 'Loading...'}</p>
                    </div>

                    <div className='password-row'>
                        <p className='password-title'>password</p>
                        <button
                            className='change-password-button'
                            onClick={() => setIsPasswordPopupOpen(true)}
                        >
                            Change
                        </button>
                    </div>
                </div>
            </div>

            {/* Change Username Popup */}
            {isUsernamePopupOpen && userData && (
                <ChangeUsername
                    currentUsername={userData.user.username}
                    onClose={() => setIsUsernamePopupOpen(false)}
                    onSuccess={handleUsernameSuccess}
                />
            )}

            {/* Change Password Popup */}
            {isPasswordPopupOpen && (
                <ChangePassword
                    onClose={() => setIsPasswordPopupOpen(false)}
                    onSuccess={handlePasswordSuccess}
                />
            )}

            {/* Profile Picture Upload Popup */}
            {isUploadPopupOpen && (
                <ProfilePictureUpload
                    onClose={() => setIsUploadPopupOpen(false)}
                    onSuccess={handleUploadSuccess}
                />
            )}

            {/* Profile Picture Delete Popup */}
            {isDeletePopupOpen && (
                <ProfilePictureDelete
                    onClose={() => setIsDeletePopupOpen(false)}
                    onSuccess={handleDeleteSuccess}
                />
            )}
        </main>
    );
}