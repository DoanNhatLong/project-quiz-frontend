import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/TeacherExam.css';
import Navbar from "../common/Navbar.jsx";

const TeacherExam = () => {
    const navigate = useNavigate();

    const options = [
        {
            title: "Tạo Đề Thi",
            desc: "Thiết kế bộ câu hỏi, đáp án và quản lý kho đề thi của bạn.",
            icon: "📝",
            path: "/admin/exam",
            btnClass: "btn-create-quiz"
        },
        {
            title: "Tạo Cuộc Thi",
            desc: "Lên lịch thi, thiết lập thời gian và phòng thi trực tuyến.",
            icon: "🏆",
            path: "/admin/create-challenge",
            btnClass: "btn-create-exam"
        },
        {
            title: "Kết Quả Cuộc Thi",
            desc: "Theo dõi điểm số, bảng xếp hạng và chi tiết bài làm thí sinh.",
            icon: "📊",
            path: "/teacher/check",
            btnClass: "btn-results"
        }
    ];

    return (
        <>
            <Navbar/>

        <div className="teacher-exam-container">
            <h2 className="teacher-exam-title">Quản lý cuộc thi </h2>

            <div className="card-grid">
                {options.map((opt, index) => (
                    <div key={index} className="management-card">
                        <div>
                            <div className="card-icon">{opt.icon}</div>
                            <h3>{opt.title}</h3>
                            <p>{opt.desc}</p>
                        </div>
                        <button
                            className={`btn-manage ${opt.btnClass}`}
                            onClick={() => navigate(opt.path)}
                        >
                            Truy cập ngay
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default TeacherExam;