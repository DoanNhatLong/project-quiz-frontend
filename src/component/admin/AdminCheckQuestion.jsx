import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../utils/modal/Modal.jsx";
import {toast} from "react-toastify";
import MarkDownView from "../../utils/MarkDownView.jsx";
import api from "../../api/axios.js";


export default function AdminCheckQuestion() {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { quizId } = useParams();

    useEffect(() => {
        api.get(`/questions/detail/${quizId}`)
            .then(response => {
                setQuestions(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách câu hỏi:", error);
                setIsLoading(false);
            });
    }, [quizId]);

    const handleDelete = (id) => {
        api.delete(`/questions/${id}`)
            .then(() => {
                setQuestions(questions.filter(q => q.id !== id));
            })
            .catch(err => {
                console.error(err);
                toast.error("Xóa thất bại!");
            });
    };

    if (isLoading) return <div className="admin-card">Đang tải dữ liệu...</div>;

    return (
        <div className="admin-table-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        className="btn-admin"
                        style={{ backgroundColor: '#6c757d', color: 'white' }}
                        onClick={() => navigate('/admin/quiz')}
                    >
                        Quay lại
                    </button>
                    <h2 style={{ margin: 0 }}>
                        Bộ quiz: <span style={{ color: 'red', fontSize : "16px" }}>{questions[0]?.quiz?.title}</span>
                    </h2>
                </div>
                <span className="badge-category">Tổng số: {questions.length} câu</span>
            </div>

            <table className="admin-table">
                <thead>
                <tr>
                    <th style={{ width: '50px' }}>STT</th>
                    <th style={{ width: '40%' }}>Nội dung câu hỏi</th>
                    <th>Danh sách đáp án</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {questions.map((q, index) => (
                    <tr key={q.id}>
                        <td style={{ textAlign: 'center' }}>{q.orderIndex || index + 1}</td>
                        <td style={{ fontWeight: '500', verticalAlign: 'top' }}>
                            <MarkDownView content={q.content} />
                            <br />
                            <small style={{ color: '#888', fontWeight: 'normal' }}>
                                Loại: {q.type === 'single' ? 'Chọn 1' : 'Chọn nhiều'}
                            </small>
                        </td>
                        <td>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {q.answers.map(ans => (
                                    <li
                                        key={ans.id}
                                        style={{
                                            padding: '4px 8px',
                                            marginBottom: '4px',
                                            borderRadius: '4px',
                                            backgroundColor: ans.correct ? '#e8f5e9' : 'transparent',
                                            color: ans.correct ? '#2e7d32' : '#333',
                                            border: ans.correct ? '1px solid #c8e6c9' : '1px solid transparent'
                                        }}
                                    >
                                        {ans.correct ? '✔️ ' : '○ '}
                                        {ans.content || <i style={{ color: '#ccc' }}>Trống</i>}
                                    </li>
                                ))}
                            </ul>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button
                                    className="btn-admin"
                                    style={{ backgroundColor: '#f1c40f', color: '#000' }}
                                    onClick={() => navigate(`/admin/questions/edit/${q.id}/6`)}
                                >
                                    Edit
                                </button>

                                <ConfirmModal
                                    message={`Bạn có chắc chắn muốn xóa câu hỏi số ${q.orderIndex || index + 1}?`}
                                    onConfirm={() => handleDelete(q.id)}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}