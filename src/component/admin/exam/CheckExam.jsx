import {useEffect, useState} from "react";
import {deleteExam, getAllExams} from "../../../service/adminService.js";
import {useNavigate} from "react-router-dom";
import DeleteModal from "../../../utils/modal/DeleteModal.jsx";

export default function CheckExam() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);

    const loadExams = () => {
        setLoading(true);
        getAllExams()
            .then(res => { setExams(res); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    };

    useEffect(() => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
        loadExams();
        },
        []);

    const openDeleteModal = (id) => {
        setSelectedExamId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedExamId) {
            deleteExam(selectedExamId)
                .then(() => {
                    setIsModalOpen(false);
                    loadExams(); // Refresh danh sách sau khi xóa mềm
                })
                .catch(err => console.error("Lỗi xóa:", err));
        }
    };


    if (loading) {
        return <div className="nes-text is-error" style={{padding: '20px'}}>Loading...</div>;
    }

    return (
        <div style={{padding: '20px', maxWidth: '1000px', margin: '0 auto'}}>
            <h2 style={{marginBottom: '20px'}}>Danh sách đề thi đã tạo</h2>

            <div style={{display: 'grid', gap: '15px'}}>
                {exams.length > 0 ? (
                    exams.map((item) => (
                        <div key={item.id} style={{
                            border: '1px solid #ccc',
                            padding: '15px',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <div style={{flex: 1}}>
                                <h3 style={{margin: '0 0 5px 0', color: '#333'}}>{item.title}</h3>
                                <p style={{margin: '0', color: '#666', fontSize: '14px'}}>{item.description}</p>
                                <div style={{marginTop: '10px', fontSize: '13px', display: 'flex', gap: '15px'}}>
                                    <span style={{fontWeight: 'bold', color: '#0056b3'}}>
                                    📝 {item.examQuestions.length || 0} câu hỏi
                                    </span>
                                    <span>⏱ {item.durationMinutes} phút</span>
                                    <span>🎯 Điểm đạt: {item.passScorePercentage * 100}%</span>
                                    <span>👤 Người tạo: <strong>{item.user.username || "N/A"}</strong></span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/admin/exam/${item.id}`)}
                                style={{
                                    padding: '8px 15px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Xem chi tiết
                            </button>
                            <button
                                onClick={() => openDeleteModal(item.id)}
                                style={{
                                    padding: '8px 15px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginLeft: '10px'
                                }}
                            >
                                Xóa
                            </button>

                        </div>
                    ))
                ) : (
                    <p>Chưa có đề thi nào được tạo.</p>
                )}

            </div>
            <DeleteModal
                open={isModalOpen}
                message="Bạn có chắc muốn xóa đề thi này?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsModalOpen(false)}
            />

        </div>
    );
}