const AdminDashboard = () => {
    return (
        <div>

            <div className="admin-stats-grid">
                <div className="admin-card">
                    <h3>Tổng người dùng</h3>
                    <p>1,250</p>
                </div>
                <div className="admin-card">
                    <h3>Tổng bài Quiz</h3>
                    <p>85</p>
                </div>
                <div className="admin-card">
                    <h3>Tổng đề thi</h3>
                    <p>5,432</p>
                </div>
            </div>

            <div className="admin-card" style={{ marginTop: '40px' }}>
                <h3>Hoạt động mới nhất</h3>
                <div style={{ marginTop: '20px', color: '#666' }}>
                    Chưa có hoạt động nào được ghi nhận.
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;