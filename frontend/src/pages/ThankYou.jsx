import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ThankYou.css';

const ThankYou = () => {
    const navigate = useNavigate();

    return (
        <div className="thank-you-page">
            <div className="thank-you-container">
                <div className="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <h1>Thank You!</h1>
                <p className="success-message">Your service is on the way.</p>
                <p className="sub-message">We have received your payment and booking details.</p>

                <div className="action-buttons">
                    <Link to="/dashboard" className="btn btn-primary">
                        Go to Dashboard
                    </Link>
                    <Link to="/" className="btn btn-secondary">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
