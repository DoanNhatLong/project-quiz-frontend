import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Content.css';

const Content = () => {
    const navigate = useNavigate();

    const cards = [
        { id: 2, title: 'Java', img: '/assets/image/java.jpg', desc: 'Viết một lần, chạy mọi nơi' },
        { id: 1, title: 'JavaScript', img: '/assets/image/js.jpg', desc: 'Ngôn ngữ vạn năng' },
        { id: 3, title: 'Cửa hàng', img: '/assets/image/store.jpg', desc: 'Mua một số thứ nào' },
        { id: 4, title: 'Cuộc thi', img: '/assets/image/challenger.jpg', desc: 'Thể hiện thành quả' }
    ];

    const handleCardClick = (id) => {
        switch (id) {
            case 1:
                navigate('/quiz/js');
                break;
            case 2:
                navigate('/quiz/java');
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