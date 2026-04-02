import React, {useRef, useState} from 'react';
import ExamModal from "../../../utils/modal/ExamModal.jsx";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {createChallenger, getAllChallengers} from "../../../service/adminService.js";
import {useApi} from "../../../hooks/useApi.jsx";

export default function ChallengerCreate() {
    const {data: challengers} = useApi(getAllChallengers);

    const titleRef = useRef();
    const accessCodeRef = useRef();
    const startTimeRef = useRef();
    const allowRejoinRef = useRef();
    const userId= useSelector((state) => state.user.data?.id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const [selectedExam, setSelectedExam] = useState(null);

    const handleSelectExam = (exam) => {
        setSelectedExam(exam);
        setIsModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedExam) {
            alert("Vui lòng chọn đề thi trước!");
            return;

        }
        const isDuplicate = challengers?.some(
            (item) => item.accessCode.toLowerCase() === accessCodeRef.current.value.toLowerCase()
        );

        if (isDuplicate) {
            toast.error("Mã truy cập này đã tồn tại! Vui lòng chọn mã khác.");
            return;
        }

        const payload = {
            title: titleRef.current.value,
            accessCode: accessCodeRef.current.value,
            startTime: startTimeRef.current.value,
            durationMinutes: selectedExam.durationMinutes,
            allowRejoin: allowRejoinRef.current.checked,
            examId: selectedExam.id,
            userId: userId
        };

        console.log("Payload gửi đi:", payload);
        createChallenger(payload)
            .then(() => {
                toast.success("Tạo thử thách mới thành công!");
                navigate("/admin");
            })
            .catch(error => {
                toast.error("Lỗi khi tạo thử thách!");
                console.log(error);
            });
    };

    return (
        <div className="challenger-container">
            <h2 className="section-title">Tạo Thử Thách Mới</h2>
            <hr />

            <div className="exam-select-section">
                <button
                    type="button"
                    className="btn-select-exam"
                    onClick={() => setIsModalOpen(true)}
                >
                    {selectedExam ? "Thay đổi đề thi" : "1. Bấm để chọn đề thi"}
                </button>
                {selectedExam && (
                    <span style={{ marginLeft: '15px', fontWeight: '500' }}>
                        Đang chọn: <b style={{ color: '#007bff' }}>{selectedExam.title}</b>
                    </span>
                )}
            </div>

            <form className="form-content" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label-required">Tiêu đề thử thách</label>
                    <input
                        type="text"
                        ref={titleRef}
                        className="form-input"
                        placeholder="Ví dụ: Cuộc thi lập trình tuần 10"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label-required">Mã truy cập (Access Code)</label>
                    <input
                        type="text"
                        ref={accessCodeRef}
                        className="form-input"
                        placeholder="Nhập mã cho người tham gia..."
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group flex-1">
                        <label className="label-required">Thời gian bắt đầu</label>
                        <input
                            type="datetime-local"
                            ref={startTimeRef}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group flex-1">
                        <label>Thời lượng (Lấy theo đề thi)</label>
                        <div className="info-display">
                            {selectedExam ? `${selectedExam.durationMinutes} phút` : "Chưa có đề thi"}
                        </div>
                    </div>
                </div>

                <label className="checkbox-group">
                    <input
                        type="checkbox"
                        ref={allowRejoinRef}
                        className="checkbox-input"
                        defaultChecked
                    />
                    <span>Cho phép người dùng vào lại khi mất kết nối</span>
                </label>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-submit"
                        disabled={!selectedExam}
                    >
                        Xác nhận tạo thử thách
                    </button>
                </div>
            </form>

            <ExamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectExam}
            />
        </div>
    );
}