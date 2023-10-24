import React, { useEffect, useState } from 'react';
import './AuthStyle/SuccessMsg.css'; // Import the CSS file for styling

const EmailVerifiedComponent = () => {
    const [seconds, setSeconds] = useState(5);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const countdownElement = document.getElementById('countdown');
        const updateCountdown = () => {
            countdownElement.innerHTML = `Redirecting in ${seconds} seconds`;
            if (seconds > 0) {
                setTimeout(() => {
                    setSeconds(seconds - 1);
                }, 1000); // This represents 1 second
            } else {
                setIsLoading(true);
                setTimeout(() => {
                    window.location.href = "http://localhost:5173/profile";
                }, 1000); // This represents 1 second
            }
        };
        updateCountdown();
    }, [seconds]);

    return (
        <div className="email-verified-container">
            <h1>Email Verified</h1>
            <p>Thank you for verifying your email address. You may now login to your account.</p>
            <div className="countdown" id="countdown"></div>
            {isLoading && (
                <div className="loading-animation">
                    <div className="loader"></div>
                    <p>Loading...</p>
                </div>
            )}
        </div>
    );
};

export default EmailVerifiedComponent;
