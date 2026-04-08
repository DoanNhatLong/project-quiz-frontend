import { useSelector } from 'react-redux';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import './css/AdminLayout.css';

const AdminPage = () => {
    const location = useLocation();
    const user = useSelector((state) => state.user.data);
    const isAdmin = user && user.roles === 'admin';
    const isTeacher= user && user.roles === 'teacher';

    if (!isAdmin && !isTeacher) {
        return <Navigate to="/" replace />;
    }

    const sensitivePaths = ['/admin/users', '/admin/log',
        '/admin/report', '/admin/quiz', '/admin/manager-exam'];
    if (isTeacher && sensitivePaths.includes(location.pathname)) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="admin-logo">{isAdmin ? "ADMIN PANEL" : "TEACHER PANEL"}</div>
                <nav className="admin-nav">
                    <Link
                        to="/admin"
                        className={`admin-link ${location.pathname === '/admin' ? 'active' : ''}`}
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/admin/exam"
                        className={`admin-link ${location.pathname === '/admin/exam' ? 'active' : ''}`}
                    >
                        Tạo đề thi
                    </Link>

                    <Link
                        to="/admin/create-challenge"
                        className={`admin-link ${location.pathname === '/admin/create-challenge' ? 'active' : ''}`}
                    >
                        Tạo cuộc thi
                    </Link>
                    {isAdmin && (
                        <>
                            <Link
                                to="/admin/users"
                                className={`admin-link ${location.pathname === '/admin/users' ? 'active' : ''}`}
                            >
                                Quản lý Users
                            </Link>

                            <Link
                                to="/admin/quiz"
                                className={`admin-link ${location.pathname === '/admin/quiz' ? 'active' : ''}`}
                            >
                                Quản lý Quiz
                            </Link>
                            <Link
                                to="/admin/manager-exam"
                                className={`admin-link ${location.pathname === '/admin/manager-exam' ? 'active' : ''}`}
                            >
                                Quản lý đề thi
                            </Link>
                            <Link
                                to="/admin/report"
                                className={`admin-link ${location.pathname === '/admin/report' ? 'active' : ''}`}
                            >
                                <span style={{ color: '#ff4757', fontWeight: 'bold' }}>Khiếu nại ghi nhận</span>
                            </Link>

                            <Link
                                to="/admin/log"
                                className={`admin-link ${location.pathname === '/admin/log' ? 'active' : ''}`}
                            >
                                <span style={{ color: 'yellow', fontWeight: 'bold' }}>Xem log</span>
                            </Link>
                        </>
                    )}

                </nav>
                <Link to="/home" className="admin-logout">
                    Thoát hệ thống
                </Link>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminPage;