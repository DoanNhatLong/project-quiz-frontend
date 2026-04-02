import {useDispatch, useSelector} from "react-redux";
import {removeQuestion, resetEditor} from "../../../redux/examEditorSlice.js";
import MarkDownView from "../../../utils/MarkDownView.jsx";
import {useState} from "react";
import ConfirmModal from "../../../utils/modal/ConfirmModal.jsx";
import {createExam} from "../../../service/adminService.js";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";


export default function ExamReview() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.data);
    const navigate = useNavigate();
    const [modal, setModal] = useState({
        open: false,
        message: "",
        onConfirm: null
    });
    const {
        type, title, durationMinutes,
        passScorePercentage, targetQuestions, selectedQuestions
    } = useSelector((state) => state.examEditor);

    const examData = useSelector((state) => state.examEditor);


    const currentCount = selectedQuestions.length;
    const isReady = currentCount >= targetQuestions;

    const handleCreateExam = async () => {
        const payload = {
            title: examData.title,
            description: examData.description,
            durationMinutes: examData.durationMinutes,
            passScorePercentage: examData.passScorePercentage,
            userId: user.id,
            questionIds: examData.selectedQuestions.map(q => q.id)
        };

        console.log("Payload gửi lên Server:", payload);

        try {
            await createExam(payload);
            toast.success("Tạo đề thi thành công!");
            dispatch(resetEditor());
            navigate("/admin");
        } catch (error) {
            console.error("Lỗi tạo đề:", error);
            toast.error("Tạo đề thất bại, vui lòng kiểm tra lại!");
        }
    };

    const handleRemove = (id) => {
        setModal({
            open: true,
            message: "Xóa câu hỏi này?",
            onConfirm: () => {
                dispatch(removeQuestion(id));
                setModal({
                    open: false,
                    message: "",
                    onConfirm: null
                });
            }
        });
    };

    const handleClearAll = () => {
        setModal({
            open: true,
            message: "Xóa tất cả câu hỏi đã chọn?",
            onConfirm: () => {
                selectedQuestions.forEach(q => dispatch(removeQuestion(q.id)));
                setModal({
                    open: false,
                    message: "",
                    onConfirm: null
                });
            }
        });
    };

    const handleCancel = () => {
        setModal({
            open: true,
            message: "Hủy toàn bộ đề thi đang tạo?",
            onConfirm: () => {
                dispatch(resetEditor());
                setModal({
                    open: false,
                    message: "",
                    onConfirm: null
                });
            }
        });
    };

    return (
        <div style={{padding: '20px', maxWidth: '900px', margin: '0 auto'}}>
            {/* 1. Thông tin cấu hình đề thi */}
            <div style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                <h2 style={{margin: '0 0 10px 0'}}>{title || "Chưa đặt tiêu đề"}</h2>
                <div style={{display: 'flex', gap: '20px', color: '#555'}}>
                    <span>Loại: <strong>{type}</strong></span>
                    <span>Thời gian: <strong>{durationMinutes} phút</strong></span>
                    <span>Điểm đạt: <strong>{passScorePercentage * 100}%</strong></span>
                    <span style={{color: isReady ? 'green' : 'red', fontWeight: 'bold'}}>
                        Số lượng: {currentCount} / {targetQuestions} câu
                    </span>
                </div>
            </div>

            {/* 2. Danh sách câu hỏi */}
            <div style={{marginBottom: '30px'}}>
                {selectedQuestions.map((q, index) => (
                    <div key={q.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                        padding: '15px', borderBottom: '1px solid #eee'
                    }}>
                        <div style={{flex: 1}}>
                            <div style={{fontWeight: 'bold', marginBottom: '5px'}}>Câu {index + 1}:</div>
                            <MarkDownView content={q.content}/>
                        </div>
                        <button
                            onClick={() => handleRemove(q.id)}
                            style={{
                                color: 'red',
                                border: '1px solid red',
                                background: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                borderRadius: '4px'
                            }}
                        >
                            Gỡ bỏ
                        </button>
                    </div>
                ))}
            </div>

            <div style={{
                position: 'sticky', bottom: 0, backgroundColor: '#fff',
                padding: '20px', borderTop: '2px solid #ddd', display: 'flex', gap: '15px'
            }}>
                <button
                    disabled={!isReady}
                    style={{
                        flex: 2, padding: '12px', fontSize: '16px', fontWeight: 'bold',
                        backgroundColor: isReady ? '#28a745' : '#ccc', color: '#fff',
                        border: 'none', borderRadius: '4px', cursor: isReady ? 'pointer' : 'not-allowed'
                    }}
                    onClick={handleCreateExam}
                >
                    {isReady ? "TẠO ĐỀ THI NGAY" : `CẦN THÊM ${targetQuestions - currentCount} CÂU HỎI`}
                </button>

                <button
                    onClick={handleClearAll}
                    style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#ffc107',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Xóa hết câu hỏi
                </button>

                <button
                    onClick={handleCancel}
                    style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Hủy đề thi
                </button>
            </div>
            <ConfirmModal
                open={modal.open}
                message={modal.message}
                onConfirm={modal.onConfirm}
                onCancel={() =>
                    setModal({
                        open: false,
                        message: "",
                        onConfirm: null
                    })
                }
            />
        </div>
    )
};