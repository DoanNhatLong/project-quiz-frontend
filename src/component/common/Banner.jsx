import React from 'react';
import './css/Banner.css';

const Banner = () => {
    return (
        <div className="main-banner-container">
            <div className="banner-content">
                {/* Hình động của bạn ở đây */}
                <img
                    src="/your-animation.gif"
                    alt="Pixel Character"
                    className="banner-pixel-art"
                />

                <span className="nes-text is-error blinking-text">
                    [!] LEVEL 1: JAVA BASICS - INSERT COIN TO CONTINUE
                </span>

                <img
                    src="/your-animation-2.gif"
                    alt="Pixel Item"
                    className="banner-pixel-art"
                />
            </div>
        </div>
    );
};

export default Banner;