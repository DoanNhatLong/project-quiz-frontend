import {useEffect, useState} from "react";
import {getStats} from "../../service/adminService.js";

const AdminDashboard = () => {
    const [data, setData] = useState()
    useEffect(() => {
        getStats()
            .then(res => setData(res))
    }, []);
    return (
        <div>
            <div className="admin-stats-grid">
                <div className="admin-card">
                    <h3>Tổng người dùng</h3>
                    <p>{data?.totalUser}</p>
                </div>
                <div className="admin-card">
                    <h3>Tổng câu hỏi</h3>
                    <p>{data?.totalQuestion}</p>
                </div>
                <div className="admin-card">
                    <h3>Tổng bộ Quiz</h3>
                    <p>{data?.totalQuizzes}</p>
                </div>
            </div>

            <div className="admin-card" style={{marginTop: '40px'}}>
                <h3>Hoạt động mới nhất</h3>
                <div style={{marginTop: '20px', color: '#666'}}>
                    Chưa có hoạt động nào được ghi nhận.
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;