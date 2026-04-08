import Navbar from "../common/Navbar.jsx";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkExam } from "../../service/adminService.js";
import "./css/TeacherCheck.css";

export default function TeacherCheck() {
    const user = useSelector((state) => state.user.data);
    const userId = user?.id;
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            checkExam(userId)
                .then(res => setData(res))
                .catch(err => console.error("Error:", err));
        }
    }, [userId]);

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="teacher-container">
                <h2 className="teacher-title">Danh Sách Bài Thi Quản Lý</h2>

                <div className="card-grid">
                    {data && data.length > 0 ? (
                        data.map((item) => (
                            <div
                                key={item.id}
                                className="exam-card"
                                onClick={() => navigate(`/teacher/exam-detail/${item.exam.id}`)}
                            >
                                <div className="challenge-label">Challenge #{item.id}</div>
                                <h3>{item.exam.title}</h3>
                                <p className="exam-desc">{item.exam.description || "Không có mô tả."}</p>

                                <div className="card-footer">
                                    <span className="time-tag">{item.exam.durationMinutes}m</span>
                                    <span>{new Date(item.exam.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{textAlign: 'center', gridColumn: '1/-1'}}>Đang tải bài thi...</p>
                    )}
                </div>
            </div>
        </div>
    );
}