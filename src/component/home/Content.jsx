import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Content.css';

const Content = () => {
    const navigate = useNavigate();

    const cards = [
        { id: 1, title: 'JavaScript', img: '/assets/image/js.jpg', desc: 'Master JS Fundamentals' },
        { id: 2, title: 'Java', img: '/assets/image/java.jpg', desc: 'Deep dive into Java' },
        { id: 3, title: 'Store', img: '/assets/image/store.jpg', desc: 'Exchange your point' },
        { id: 4, title: 'Challenger', img: '/assets/image/challenger.jpg', desc: 'Daily challenges' }
    ];

    const handleCardClick = (id) => {
        switch (id) {
            case 1:
                navigate('/quiz/quiz-js');
                break;
            case 2:
                navigate('/quiz/quiz-java');
                break;
            case 3:
                navigate('/store');
                break;
            case 4:
                navigate('/challenger');
                break;
            default:
                navigate('/');
        }
    };

    return (
        <div className="content-grid">
            {cards.map(card => (
                <div
                    key={card.id}
                    className="menu-card"
                    onClick={() => handleCardClick(card.id)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="card-image">
                        <img src={card.img} alt={card.title} />
                    </div>
                    <div className="card-info">
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Content;