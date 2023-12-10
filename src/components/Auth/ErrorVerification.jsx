import React, { useEffect, useState } from 'react';

import "./Style/errorverification.css";

const AlreadyVerifiedComponent = () => {
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        const countdownElement = document.getElementById('countdown');
        const updateCountdown = () => {
            if (seconds > 0) {
                countdownElement.innerHTML = `Redirecting in ${seconds} seconds`;
                setTimeout(() => {
                    setSeconds(seconds - 1);
                }, 1000); // This represents 1 second
            } else {
                window.location.href = "http://localhost:5173/profile";
            }
        };
        updateCountdown();
    }, [seconds]);

    return (
        <section className='main-error-verification-container'>
        <div style={{
            position:'fixed',
            zIndex: '3',
            fontFamily: 'Arial, sans-serif',
            backgroundColor : 'red',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            color: '#990000', // warning look text color
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' // box shadow
        }}>
            <h1>Email Already Verified</h1>
            <p>You are already verified. Redirecting to your profile page...</p>
            <div className="countdown" id="countdown"></div>
        </div>
        </section>
    );
};

export default AlreadyVerifiedComponent;
