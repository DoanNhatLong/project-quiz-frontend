import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserHistory } from '../../../redux/historySlice.js';
import './css/ProfileHistory.css';

export default function ProfileHistory() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.data);
    const { attempts, loading } = useSelector((state) => state.history);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    useEffect(() => {
        if (user) {
            dispatch(fetchUserHistory(user.id));
        }
    }, [user, dispatch]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) return <div className="loading-text">Đang tải dữ liệu...</div>;

    // Logic sắp xếp: Gần nhất (Mới nhất) lên đầu
    const sortedAttempts = attempts ? [...attempts].sort((a, b) => {
        return new Date(b.startedTime) - new Date(a.startedTime);
    }) : [];

    // Logic phân trang dựa trên mảng đã sắp xếp
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedAttempts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedAttempts.length / itemsPerPage);

    return (
        <div className="history-container">
            <h2 className="history-title">LỊCH SỬ THI ĐẤU</h2>
            <div className="table-wrapper">
                <table className="history-table">
                    <thead>
                    <tr>
                        <th>Tên Quiz</th>
                        <th>Thời gian</th>
                        <th>Điểm số</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((item) => (
                            <tr key={item.id}>
                                <td data-label="Quiz" className="quiz-title">{item.quiz.title}</td>
                                <td data-label="Thời gian">{formatDate(item.startedTime)}</td>
                                <td data-label="Điểm số" className="score-cell">
                                    {(item.score * 100).toFixed(0)}%
                                </td>
                                <td data-label="Trạng thái">
                                <span className={`status-badge ${item.passed ? 'pass' : 'fail'}`}>
                                    {item.passed ? 'ĐẠT' : 'CHƯA ĐẠT'}
                                </span>
                                </td>
                                <td>
                                    <button onClick={() => navigate(`/quiz-review/${item.id}`)}
                                            className="nes-btn is-primary">
                                        CHI TIẾT
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="no-data">Chưa có dữ liệu lịch sử.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="page-btn"
                    >
                        Trước
                    </button>
                    <span className="page-info">Trang {currentPage} / {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="page-btn"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
}