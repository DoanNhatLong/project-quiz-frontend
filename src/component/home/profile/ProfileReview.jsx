import React, { useMemo } from "react";
import Navbar from "../../common/Navbar.jsx";
import { useApi } from "../../../hooks/useApi.jsx";
import api from "../../../api/axios.js";
import "./css/ProfileReview.css";
import {useNavigate} from "react-router-dom";

export default function ProfileReview() {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    const navigate = useNavigate();

    const apiCall = useMemo(() => {
        return () => api.get(`/users/challenges/${userId}`);
    }, [userId]);

    const { data: challengesData } = useApi(apiCall, [userId]);

    const handleCardClick = (challengeId) => {
        navigate(`/challenger/review/${challengeId}`);
    };

    return (
        <>
            <Navbar />
            <div className="profile-review-container">
                <h3 className="page-title">Danh sách thử thách</h3>

                <div className="challenge-grid">
                    {challengesData?.data?.map((item) => (
                        <div
                            key={item.id}
                            className="challenge-card"
                            onClick={() => handleCardClick(item.id)}
                        >
                            <h4 className="challenge-title">{item.title}</h4>

                            <p className="challenge-date">
                                📅 Ngày thi: {item.startTime ? new Date(item.startTime).toLocaleDateString('vi-VN') : 'N/A'}
                            </p>

                            <div className="challenge-footer">
                                <span className="challenge-time">
                                    ⏰ Giờ thi: {item.startTime ? new Date(item.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                </span>
                                <button className="btn-start">Xem lại bài thi</button>
                            </div>
                        </div>
                    ))}
                </div>

                {(!challengesData?.data || challengesData.data.length === 0) && (
                    <div className="empty-state">
                        <p>Hiện tại bạn chưa có thử thách nào.</p>
                    </div>
                )}
            </div>
        </>
    );
}