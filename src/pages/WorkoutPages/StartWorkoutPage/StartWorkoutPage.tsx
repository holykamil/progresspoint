import { NavLink } from 'react-router-dom';
import './StartWorkoutPage.css'
import { Header } from '@/components/Header/Header'
import { TbRepeat } from "react-icons/tb";
import { IoAddCircleOutline } from "react-icons/io5";




export function StartWorkoutPage() {

    return (
        <main className="start-workout-page">
            <Header />
            <div className="start-workout-page-content">
                <h1 className='workout-launcher-header'>Workout Launcher</h1>

                <div className="workout-launcher">
                    <div className='repeat-workout-container'>
                        <TbRepeat className="repeat-workout-icon" />
                        <div className='repeat-workout-info'>
                            <p className='launcher-item'>
                                Repeat a workout
                            </p>
                            <p className="launcher-item-description">
                                Do one of your previous workouts
                            </p>
                        </div>
                        <NavLink className='repeat-workout-button' to='/repeatworkout'>
                            Start
                        </NavLink>
                    </div>

                    <div className='create-workout-container'>
                        <IoAddCircleOutline className='create-workout-icon' />
                        <div className='create-workout-info'>
                            <p className='launcher-item'>
                                Create a new workout
                            </p>
                            <p className="launcher-item-description">
                                Compose your new workout blueprint
                            </p>
                        </div>
                        <NavLink className='create-workout-button' to='/workout'>
                            START
                        </NavLink>
                    </div>
                </div>
            </div>
        </main>
    )
}