import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';

export default function Navbar() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <nav className="navbar-container">
            <button className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>
            <ul className={`nav-menu ${isOpen ? 'open' : ''}`}>
                <li onClick={() => setIsOpen(false)}><Link to="/">Trang chủ</Link></li>
                <li onClick={() => setIsOpen(false)}><Link to="/quiz/Java">Quiz Java</Link></li>
                <li onClick={() => setIsOpen(false)}><Link to="/quiz/JS">Quiz JS</Link></li>
                <li onClick={() => setIsOpen(false)}><Link to="/challenger">Cuộc thi</Link></li>
                <li onClick={() => setIsOpen(false)}><Link to="/about">Thông tin</Link></li>
            </ul>
        </nav>
    );
}