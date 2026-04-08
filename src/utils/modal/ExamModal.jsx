

import {useApi} from "../../hooks/useApi.jsx";
import {getAllExams} from "../../service/adminService.js";
import "./css/ExamModal.css";

export default function ExamModal({ isOpen, onClose, onSelect }) {
    const { data: exams, loading, error } = useApi(getAllExams, [], isOpen);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Chọn Đề Thi</h3>

                {loading && <p>Đang tải dữ liệu...</p>}
                {error && <p style={{ color: 'red' }}>Lỗi: {error.message}</p>}

                {!loading && exams && (
                    <div className="table-wrapper">
                        <table>
                            <tbody>
                            {exams.map(exam => (
                                <tr key={exam.id}>
                                    <td>{exam.title}</td>
                                    <td>
                                        <button onClick={() => onSelect(exam)}>Chọn</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <button onClick={onClose}>Đóng</button>
            </div>
        </div>
    );
}
