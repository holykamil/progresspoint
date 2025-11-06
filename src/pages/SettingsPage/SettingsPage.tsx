import { Header } from '@/components/Header/Header';
import { NavLink } from "react-router-dom";
import { RiCloseFill } from "react-icons/ri";
import './Settings.css'

import UserImage from '@/assets/images/account-image.png'
import { useEffect, useState } from "react";
import type { UserData } from "@/types/user";
import { fetchWithAuth } from "@/lib/api";


export function SettingsPage() {
    useEffect(() => {
        fetchUserData();
    }, []);

    const [userData, setUserData] = useState<UserData | null>(null);

    async function fetchUserData() {
        try {
            const response = await fetchWithAuth('/api/me');

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data: UserData = await response.json();
            setUserData(data);
        } catch (err) {
            console.error('Error fetching user data:', err);
            // Don't set error here, let workouts error handling show
        }
    }

    return (
        <main className="settings-page">
            <Header />
            <div className="settings-page-content">
                <div className='settings-dashboard'>
                    <NavLink className='exit-settings-button' to='/user'>
                        <RiCloseFill className='exit-settings-icon' />
                    </NavLink>
                    <h1 className='settings-header'>Settings</h1>
                    <div className='picture-row'>
                        <div className='profile-picture-container'>
                            <img src={UserImage} alt="User profile" />
                        </div>
                        <div className="picture-general-info-container">
                            <p className="picture-header">Profile picture</p>
                            <p className="picture-info">PNG, JPG under 15MB</p>
                        </div>
                        <button className='upload-profile-picture-button'>
                            Upload new picture
                        </button>
                        <button className='delete-profile-picture-button'>
                            Delete
                        </button>
                    </div>
                    <div className='username-row'>
                        <p className='username-row-title'>username:</p>
                        <p className='username'>{userData?.user.username}</p>
                        <button className='change-username-button'>Change</button>
                    </div>
                    <div className='email-row'>
                        <p className='email-row-title'>e-mail:</p>
                        <p className='userEmail'>{userData?.user.email}</p>
                    </div>
                    <div className='password-row'>
                        <p className='password-title'>password</p>
                        <button className='change-password-button'>Change</button>
                    </div>
                </div>
            </div>
        </main>

    )

}