import './UserPage.css'
import { Header } from '../../components/Header/Header'
import { NavLink } from 'react-router-dom'

import UserImage from '@/assets/images/account-image.png'
import SettingsIcon from '@/assets/images/settings-icon.png'
import type { UserData } from '@/types/user'
import { useEffect, useState } from 'react'
import { fetchWithAuth } from '@/lib/api'
import { formatDate } from '@/lib/date';

export function UserPage() {
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
        <main className="user-page">
            <Header />
            <div className="user-page-content">
                <div className='user-dashboard'>
                    <div className="user-dashboard-first-row">
                        <div className='user-image-container'>
                            <img src={UserImage} alt="User profile" />
                        </div>
                        <div className="user-general-info-container">
                            <p className="user-nickname">{userData?.user.username}</p>
                            <p className="user-joined-time">Joined {formatDate(userData?.user.createdAt)}</p>
                        </div>
                        <NavLink to="/settings" className='Settings'>
                            <img src={SettingsIcon} alt="Settings" />
                        </NavLink>
                    </div>
                    <div className="user-dashboard-second-row">
                        <div className="stat-item">
                            <p className="stat-value">{formatDate(userData?.lastWorkoutDate)}</p>
                            <p className="stat-label">Last workout</p>
                        </div>
                        <div className="stat-item">
                            <p className="stat-value">{userData?.currentStreak} days</p>
                            <p className="stat-label">Streak</p>
                        </div>
                        <div className="stat-item">
                            <p className="stat-value">{userData?.totalWorkouts}</p>
                            <p className="stat-label">Total workouts</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}