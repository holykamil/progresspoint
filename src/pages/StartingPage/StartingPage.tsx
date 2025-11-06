import './StartingPage.css'
import Logo from '@/assets/images/logo.png'
import { NavLink } from 'react-router-dom'


export function StartingPage() {

    // Small data structure — easy to change order / color / content
    const lines = [
        { text: 'STAY ON' },
        { text: 'POINT', color: 'red' },   // this line will be red
        { text: 'WITH YOUR' },
        { text: 'FITNESS' },
        { text: 'PROGRESS' }
    ]

    return (
        <main className="starting-page" aria-label="Starting page">
            <div className="starting-page-content">
                <div className="logo-container">
                    <img className="logo" src={Logo} alt="Logo" />
                </div>

                <h1 className="text-container">
                    {lines.map((line, idx) => (
                        // Each line is its own block so you can style/space individually
                        <span
                            key={idx}
                            className={`text-line ${line.color === 'red' ? 'text-red' : ''}`}
                            aria-hidden={false}
                        >
                            {line.text}
                        </span>
                    ))}
                </h1>
                <div className="button-container">
                    <NavLink to="/login" className="login-button">Log In</NavLink>
                    <NavLink to="/signin" className="signin-button">Sign Up</NavLink>
                </div>
            </div>
        </main>
    )
}
