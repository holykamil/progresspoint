import './UserPage.css'
import { Header } from '../../components/Header/Header'
import { NavLink } from 'react-router-dom'
import { StatsCard } from '@/components/stats/StatsCard/StatsCard'

import UserImage from '@/assets/images/account-image.png'
import SettingsIcon from '@/assets/images/settings-icon.png'
import type { UserData } from '@/types/user'
import { useEffect, useState } from 'react'
import { fetchUserData, fetchProfilePicture } from '@/lib/userApi'
import { formatDate } from '@/lib/date';

export function UserPage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    useEffect(() => {
        loadUserData();
        loadProfilePicture();
    }, []);

    async function loadUserData() {
        const data = await fetchUserData();
        if (data) {
            setUserData(data);
        }
    }
    async function loadProfilePicture() {
        const imageUrl = await fetchProfilePicture();
        setProfileImageUrl(imageUrl);
    }

    return (
        <main className="user-page">
            <Header />
            <div className="user-page-content">
                <div className='user-dashboard'>
                    <div className="user-dashboard-first-row">
                        <div className='user-image-container'>
                            <img src={profileImageUrl || UserImage} alt="User profile" />
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


                <div className='user-page-stats'>
                    {userData && (
                        <>
                            <h2 className="user-page-section-title">Stats</h2>
                            <div className="user-page-stats-grid">
                                <StatsCard
                                    label="Streak"
                                    value={userData.currentStreak}
                                    suffix=" days"
                                    index={0}
                                    clickable={false}
                                />
                                <StatsCard
                                    label="Total workouts"
                                    value={userData.totalWorkouts}
                                    suffix=" workouts"
                                    index={1}
                                    clickable={false}
                                />
                                <StatsCard
                                    label="Favorite exercise"
                                    value={userData.favoriteExercise?.name || 'N/A'}
                                    index={8}
                                    clickable={false}
                                />
                                <StatsCard
                                    label="Unique exercises"
                                    value={userData.totalExercisesUsed}
                                    suffix=" exercises"
                                    index={2}
                                    clickable={false}
                                />
                                <StatsCard
                                    label="Total sets"
                                    value={userData.totalSets}
                                    suffix=" sets"
                                    index={3}
                                    clickable={false}
                                />
                                <StatsCard
                                    label="Heaviest lift"
                                    value={userData.heaviestWeight}
                                    suffix=" kg"
                                    index={6}
                                    clickable={false}
                                />
                                <StatsCard
                                    label="Total duration"
                                    value={userData.totalDuration}
                                    suffix=" minutes"
                                    index={5}
                                    clickable={false}
                                />
                                <StatsCard
                                    label="Total reps"
                                    value={userData.totalReps}
                                    suffix=" reps"
                                    index={4}
                                    clickable={false}
                                />
                                <StatsCard
                                    label="Volume"
                                    value={userData.totalVolume}
                                    suffix=" kg"
                                    index={7}
                                    clickable={false}
                                />

                            </div>
                        </>
                    )}
                </div>

            </div>
        </main>
    )
}