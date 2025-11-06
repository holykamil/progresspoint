import { NavLink } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import Logo from '@/assets/images/logo.png'
import AccountLogo from '@/assets/images/account-logo.png'
import { useAuth } from '@/authentication/AuthContext';
import './Header.css'

export function Header() {
    const { logout } = useAuth();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const accountButtonRef = useRef<HTMLAnchorElement>(null);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node) &&
                accountButtonRef.current &&
                !accountButtonRef.current.contains(event.target as Node)
            ) {
                setIsPopupOpen(false);
            }
        };

        if (isPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupOpen]);

    const handleAccountClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsPopupOpen(!isPopupOpen);
    };

    const handleLogout = () => {
        setIsPopupOpen(false);
        logout();
    };

    return (
        <>
            <header className="header-wrapper">
                <div className="header">
                    <div className="left-section">
                        <NavLink to="/home">
                            <img className="header-logo" src={Logo} alt="Logo" />
                        </NavLink>
                    </div>
                    <div className="middle-section">
                        <NavLink to="/home" className="home-button">
                            Home
                        </NavLink>
                        <NavLink to="/startworkout" className="start-workout-button">
                            Start workout
                        </NavLink>
                        <NavLink to="/history" className="history-button">
                            History
                        </NavLink>
                    </div>
                    <div className="right-section">
                        <a
                            ref={accountButtonRef}
                            onClick={handleAccountClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <img className="account-logo" src={AccountLogo} alt="AccountLogo" />
                        </a>
                        {isPopupOpen && (
                            <div ref={popupRef} className='header-popup'>
                                <NavLink
                                    className="account-button"
                                    to='/user'
                                    onClick={() => setIsPopupOpen(false)}
                                >
                                    Account
                                </NavLink>
                                <button className='logout-button' onClick={handleLogout}>
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}