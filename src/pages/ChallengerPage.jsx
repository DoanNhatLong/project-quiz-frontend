import React from 'react';
import { Outlet } from 'react-router-dom';
import "./css/ChallengerPage.css";

export default function ChallengerPage() {
    return (
        <div className="challenger-page-container">
            <div className="challenger-content-wrapper">
                <Outlet />
            </div>
        </div>
    );
}