import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";
import AddQuizModal from "../../utils/modal/AddQuizModal.jsx";
import ConfirmAddQuestionModal from "../../utils/modal/ConfirmAddQuestionModal.jsx";
import api from "../../api/axios.js";
import SubjectManagementModal from "../../utils/modal/SubjectManagementModal.jsx";
const AdminQuiz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSubjectOpen, setIsModalSubjectOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const fetchQuizzes = () => {
        api.get(`${import.meta.env.VITE_API_BASE_URL}/quizzes`)
            .then(response => setQuizzes(response.data))
            .catch(error => console.error("Lỗi:", error));
    };

    const handleSaveQuiz = async (quizData) => {
        try {
            const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/quizzes/create`, quizData);
            if (response.status === 201 || response.status === 200) {
                toast.success("Tạo Quiz mới thành công!");
                setIsModalOpen(false);
                fetchQuizzes();
            }
        } catch (error) {
            toast.error("Lỗi khi tạo Quiz!");
            console.log(error);
        }
    };

    useEffect(() => {
        api.get(`${import.meta.env.VITE_API_BASE_URL}/quizzes`)
            .then(response => {
                setQuizzes(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách Quiz:", error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <div className="admin-card">Đang tải dữ liệu...</div>;

    return (
        <div>
            <div className="admin-table-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <button
                        className="btn-admin"
                        style={{ backgroundColor: 'goldenrod', color: 'white' }}
                        onClick={() => setIsModalSubjectOpen(true)}
                    >
                        ➕ Thêm chủ đề mới
                    </button>
                    <button
                        className="btn-admin"
                        style={{ backgroundColor: '#27ae60', color: 'white' }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        ➕ Thêm Quiz mới
                    </button>
                </div>
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th style={{ width: '50px' }}>STT</th>
                        <th style={{ width: '200px' }}>Tiêu đề</th>
                        <th>Mô tả</th>
                        <th>Độ khó </th>
                        <th style={{ width: '100px' }}>Điểm đạt</th>
                        <th style={{ width: '280px', textAlign: 'center' }}>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {quizzes.map((quiz, index) => (
                        <tr key={quiz.id}>
                            <td>{index+1}</td>
                            <td style={{ fontWeight: 'bold' }}>{quiz.title}</td>
                            <td style={{ fontSize: '0.9rem', color: '#666' }}>{quiz.description}</td>
                            <td style={{ fontSize: '0.9rem', color: '#666' }}>{quiz.level}</td>
                            <td>
                                <span className="badge-pass">
                                    {Math.round(quiz.passScore * 100)}%
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    <button
                                        className="btn-admin"
                                        style={{
                                            backgroundColor: '#3498db',
                                            color: 'white',
                                            padding: '8px 12px',
                                            fontSize: '0.85rem',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onClick={() => navigate(`/admin/${quiz.id}/check-questions`)}
                                    >
                                        Xem câu hỏi
                                    </button>
                                    <button
                                        className="btn-admin"
                                        style={{
                                            backgroundColor: '#8e44ad',
                                            color: 'white',
                                            padding: '8px 12px',
                                            fontSize: '0.85rem',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onClick={() => {
                                            setSelectedQuiz(quiz);
                                            setIsConfirmOpen(true);
                                        }}
                                    >
                                        Thêm câu hỏi
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <AddQuizModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveQuiz}
            />

            <SubjectManagementModal
                isOpen={isModalSubjectOpen}
                onClose={() => setIsModalSubjectOpen(false)}
            />

            <ConfirmAddQuestionModal
                isOpen={isConfirmOpen}
                quizTitle={selectedQuiz?.title}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    setIsConfirmOpen(false);
                    navigate(`/admin/${selectedQuiz.id}/add-questions`);
                }}
            />
        </div>
    );
};

export default AdminQuiz;