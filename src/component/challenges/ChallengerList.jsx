import React from 'react';
import { useApi } from "../../hooks/useApi.jsx";

import { useNavigate } from "react-router-dom";
import "./css/ChallengerList.css";
import {getAllChallengers} from "../../service/adminService.js";
import {toast} from "react-toastify";
import {BackButton} from "../../utils/Back.jsx";
import Swal from "sweetalert2";

export default function ChallengerList() {
    const { data: challengers, loading, error } = useApi(getAllChallengers, []);
    const navigate = useNavigate();

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleJoinClick = (item) => {
        Swal.fire({
            title: `Nhập mã để vào phòng thi: ${item.title}`,
            input: 'text',
            showCancelButton: true,
        }).then((result) => {
            const inputCode = result.value;

            if (result.isDismissed || inputCode === undefined) return;

            if (inputCode.trim() === item.accessCode) {
                toast.success("Mã chính xác! Đang vào phòng chờ...");
                navigate(`/challenger/waiting/${item.id}`, {
                    state: { isVerified: true }
                });
            } else {
                toast.error("Mã truy cập không đúng. Vui lòng thử lại!");
            }
        });
    };

    return (
        <div className="challenger-user-container">
            <BackButton navigate={navigate} path="/home" />
            {loading && <div className="empty-state">Đang tìm kiếm các phòng chờ...</div>}
            {error && <div className="empty-state" style={{color: 'red'}}>Không thể kết nối máy chủ.</div>}

            <div className="challenger-grid">
                {!loading && challengers?.length > 0 ? (
                    challengers.map((item) => (
                        <div key={item.id} className="challenger-card">
                            <div className="status-badge">ĐANG ĐỢI</div>
                            <div className="card-title">{item.title}</div>

                            <div className="card-info">
                                📅 <span>Bắt đầu: {formatTime(item.startTime)}</span>
                            </div>
                            <div className="card-info">
                                ⏱️ <span>Thời lượng: {item.durationMinutes} phút</span>
                            </div>

                            <button
                                className="btn-join"
                                onClick={() => handleJoinClick(item)}
                            >
                                Tham gia ngay
                            </button>
                        </div>
                    ))
                ) : (
                    !loading && <div className="empty-state">Hiện không có thử thách nào khả dụng.</div>
                )}
            </div>
        </div>
    );
}