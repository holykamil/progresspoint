import './ExitWarningPopup.css';

interface ExitWarningPopupProps {
    onCancel: () => void;
    onDiscard: () => void;
}

export function ExitWarningPopup({ onCancel, onDiscard }: ExitWarningPopupProps) {
    return (
        <>
            <div className="exit-warning-overlay" onClick={onCancel} />
            <div className="exit-warning-container">
                <div className="exit-warning-popup">
                    <h2 className="exit-warning-title">Leave workout?</h2>
                    <p className="exit-warning-message">
                        You have an active workout. Are you sure you want to discard it?
                    </p>

                    <div className="exit-warning-buttons">
                        <button
                            className="exit-warning-cancel-button"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="exit-warning-discard-button"
                            onClick={onDiscard}
                        >
                            Discard workout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}