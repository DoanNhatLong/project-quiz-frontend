import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar.jsx";

export default function QuizResult() {
    const location = useLocation();
    const navigate = useNavigate();

    const { correct = 0, total = 0, isGuest = false } = location.state || {};

    return (
        <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <Navbar />

            <div style={{
                maxWidth: "400px",
                margin: "80px auto",
                padding: "30px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                textAlign: "center"
            }}>
                <h2 style={{ color: "#333", marginBottom: "20px" }}>Kết quả bài làm</h2>

                <div style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
                    Bạn đã trả lời đúng: <strong style={{ color: "#28a745", fontSize: "1.5rem" }}>{correct}/{total}</strong> câu.
                </div>

                {isGuest && (
                    <div style={{
                        fontSize: "0.9rem",
                        color: "#856404",
                        backgroundColor: "#fff3cd",
                        padding: "10px",
                        borderRadius: "4px",
                        marginBottom: "20px"
                    }}>
                        Đăng nhập để xem chi tiết đáp án và lời giải.
                    </div>
                )}

                <button
                    onClick={() => navigate("/home")}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
}