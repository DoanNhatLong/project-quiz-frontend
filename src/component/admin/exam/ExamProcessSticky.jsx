import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ExamProgressSticky() {
    const navigate = useNavigate();
    const { selectedQuestions, targetQuestions, title } = useSelector((state) => state.examEditor);

    const currentCount = selectedQuestions.length;
    const isReady = currentCount >= targetQuestions;
    const progress = Math.min((currentCount / targetQuestions) * 100, 100);

    return (
        <div
            onClick={() => navigate('/admin/exams/review')}
            style={{
                position: 'sticky', top: 0, zIndex: 1000,
                backgroundColor: '#fff', padding: '15px 30px',
                cursor: 'pointer', marginBottom: '20px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>
                    <strong>{title}</strong>
                    <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
                        (Click để xem chi tiết danh sách)
                    </span>
                </span>
                <span style={{ fontWeight: 'bold', color: isReady ? 'green' : '#333' }}>
                    {currentCount} / {targetQuestions} câu
                </span>
            </div>

            <div style={{ width: '100%', height: '10px', backgroundColor: '#eee', borderRadius: '5px' }}>
                <div style={{
                    width: `${progress}%`, height: '100%',
                    backgroundColor: isReady ? '#28a745' : '#007bff',
                    transition: '0.3s'
                }} />
            </div>
        </div>
    );
};