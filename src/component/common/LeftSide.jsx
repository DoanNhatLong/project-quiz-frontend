import React, { useState, useEffect } from 'react';
import './css/LeftSide.css';
import api from "../../api/axios.js";

const LeftSide = () => {
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await api.get("/users/admin", {
                params: { page: 0, size: 5 }
            });
            setTopUsers(response.data.content);
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    // Lấy XP của người đứng đầu để làm mốc 100%
    const maxXP = topUsers.length > 0 ? topUsers[0].xp : 1;

    return (
        <aside style={{ padding: "20px", width: "300px" }}>
            <div className="nes-container is-rounded is-success" style={{ backgroundColor: '#fff' }}>
                <h3 style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px' }}>
                    RANKING
                </h3>

                <div className="panel-content">
                    {loading ? (
                        <p style={{ textAlign: 'center', fontSize: '0.7rem' }}>Loading...</p>
                    ) : topUsers.map((user, index) => {
                        // Tính tỷ lệ phần trăm so với Top 1
                        const percentage = Math.round((user.xp / maxXP) * 100);

                        return (
                            <div key={user.id} className="leaderboard-item">
                                <div className="user-info-row">
                                    <span className="rank-username">
                                        {index + 1}. {user.username}
                                    </span>
                                    <span className="xp-display">{user.xp} XP</span>
                                </div>

                                {/* Thanh tiến trình NES.css */}
                                <progress
                                    className={`nes-progress ${index === 0 ? 'is-primary' : 'is-success'}`}
                                    value={percentage}
                                    max="100"
                                ></progress>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default LeftSide;