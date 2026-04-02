import React, { useState } from 'react';
import './css/Store.css';
import Navbar from "../common/Navbar.jsx";

const Store = () => {
    // Giả sử đây là dữ liệu từ API trả về
    const [badges, setBadges] = useState([
        {
            id: 1,
            display_name: 'Newbie',
            name_code: 'nes-badge', // Badge mặc định của NES
            icon_code: 'ra ra-clover',
            price: 100
        },
        {
            id: 2,
            display_name: 'Warrior',
            name_code: 'nes-badge is-primary', // Badge màu xanh dương
            icon_code: 'ra ra-sword',
            price: 500
        },
        {
            id: 3,
            display_name: 'Emerald King',
            name_code: 'nes-badge is-success', // Badge màu xanh lá
            icon_code: 'ra ra-emerald',
            price: 1000
        }
    ]);

    const handleBuy = (badge) => {
        if (window.confirm(`Bạn có muốn mua danh hiệu [${badge.display_name}] với giá ${badge.price} Point?`)) {
            // Logic trừ point và thêm vào Inventory ở đây
            console.log("Đã mua:", badge.display_name);
        }
    };

    return (
        <>
            <Navbar/>
        <div className="store-container">
            <h2 className="nes-text is-warning" style={{ textAlign: 'center', marginBottom: '30px' }}>
                <i className="nes-icon coin is-small"></i> BADGE STORE
            </h2>

            <div className="store-grid">
                {badges.map(badge => (
                    <div key={badge.id} className="nes-container is-rounded is-dark badge-card">
                        {/* 1. Hiển thị Icon từ mã lưu trong DB */}
                        <div className="badge-icon-view">
                            <i className={badge.icon_code}></i>
                        </div>

                        {/* 2. Hiển thị Name kiểu đóng khung (Badge) */}
                        <div className="badge-name-view">
                            <span className={badge.name_code}>{badge.display_name}</span>
                        </div>

                        <button
                            className="nes-btn is-warning is-fullwidth btn-buy"
                            onClick={() => handleBuy(badge)}
                        >
                            {badge.price} P
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default Store;