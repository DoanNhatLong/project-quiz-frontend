import React from "react";
import Navbar from "../common/Navbar.jsx";

const AboutUs = () => {
    // Style objects to keep the JSX clean
    const sectionStyle = {
        padding: "80px 20px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: "#2d3436",
        backgroundColor: "#ffffff",
        minHeight: "100vh"
    };

    const containerStyle = {
        maxWidth: "1100px",
        margin: "0 auto"
    };

    const cardStyle = {
        padding: "30px",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        borderRadius: "16px",
        border: "1px solid #e9ecef",
        transition: "transform 0.3s ease"
    };

    return (
        <>
            <Navbar/>
            <div style={sectionStyle}>
                <div style={containerStyle}>
                    {/* Tiêu đề chính */}
                    <div style={{textAlign: "center", marginBottom: "60px"}}>
                        <h1 style={{fontSize: "42px", fontWeight: "800", color: "#1a1a1a", marginBottom: "15px"}}>
                            Về <span style={{color: "#2ecc71"}}>Chúng Tôi</span>
                        </h1>
                        <p style={{fontSize: "18px", color: "#636e72", maxWidth: "600px", margin: "0 auto"}}>
                            Nền tảng thi trắc nghiệm trực tuyến giúp bạn nâng tầm kiến thức mỗi ngày.
                        </p>
                    </div>

                    {/* Nội dung giới thiệu */}
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "50px",
                        marginBottom: "80px",
                        alignItems: "center"
                    }}>
                        <div style={{flex: "1 1 450px"}}>
                            <h2 style={{fontSize: "28px", color: "#2d3436", marginBottom: "20px"}}>Sứ mệnh & Tầm
                                nhìn</h2>
                            <p style={{fontSize: "16px", lineHeight: "1.8", color: "#4a4a4a", marginBottom: "20px"}}>
                                Chúng tôi tin rằng việc học tập không bao giờ có điểm dừng. QuizApp ra đời với mục tiêu
                                số hóa quy trình đánh giá năng lực, giúp học viên tiếp cận với kho đề thi chất lượng cao
                                và nhận kết quả phản hồi tức thì.
                            </p>
                            <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                                {["Giao diện thân thiện, dễ sử dụng", "Hệ thống chấm điểm tự động chính xác", "Báo cáo tiến độ học tập chi tiết"].map((text, i) => (
                                    <div key={i} style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                        <span style={{color: "#2ecc71", fontSize: "20px"}}>✓</span>
                                        <span style={{fontWeight: "500"}}>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Khối thống kê */}
                        <div style={{flex: "1 1 350px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
                            {[
                                {label: "Học viên", val: "10K+"},
                                {label: "Đề thi", val: "500+"},
                                {label: "Lượt thi", val: "50K+"},
                                {label: "Đánh giá", val: "4.9⭐"}
                            ].map((item, index) => (
                                <div key={index} style={cardStyle}>
                                    <div style={{
                                        fontSize: "24px",
                                        fontWeight: "800",
                                        color: "#2ecc71",
                                        marginBottom: "5px"
                                    }}>{item.val}</div>
                                    <div style={{
                                        fontSize: "14px",
                                        color: "#b2bec3",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px"
                                    }}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chân trang About */}
                    <div style={{
                        textAlign: "center",
                        padding: "40px",
                        backgroundColor: "#1a1a1a",
                        borderRadius: "20px",
                        color: "#fff"
                    }}>
                        <h3 style={{marginBottom: "15px"}}>Sẵn sàng chinh phục thử thách?</h3>
                        <p style={{opacity: "0.8", marginBottom: "25px"}}>Tham gia cùng hàng nghìn học viên khác ngay
                            hôm nay.</p>
                        <button
                            style={{
                                padding: "12px 35px",
                                backgroundColor: "#2ecc71",
                                color: "#fff",
                                border: "none",
                                borderRadius: "30px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                            onClick={() => window.location.href = '/'}
                        >
                            Bắt đầu ngay
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutUs;