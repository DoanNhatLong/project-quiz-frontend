import React from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';

export default function Navbar() {
    return (
        <nav className="navbar-container">
            <ul className="nav-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/quiz/Java">Quiz Java</Link></li>
                <li><Link to="/quiz/JS">Quiz JS</Link></li>
                <li><Link to="/challenger">Challenger</Link></li>
                <li><Link to="/about-us">About Us</Link></li>
            </ul>
        </nav>
    );
}