import Navbar from "../common/Navbar.jsx";
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {getAttempt, getReport, getReview, getSelectAnswer, sendReport} from "../../service/userService.js";
import MarkDownView from "../../utils/MarkDownView.jsx";
import "./css/ChallengerReview.css"
import {BackButton} from "../../utils/Back.jsx";
import ReportModal from "../../utils/modal/ReportModal.jsx";
import {toast} from "react-toastify";

export default function ChallengerReview() {
    const [data, setData] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [attempt, setAttempt] = useState(null);
    const params = useParams();
    const navigate = useNavigate();
    const attemptId = params.challengeId;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReported, setIsReported] = useState(false);
    useEffect(() => {
        getReview(attemptId)
            .then(res => setData(res))
            .catch(error => console.error("Lỗi khi lấy thông tin review:", error));
        getSelectAnswer(attemptId)
            .then(res => setAnswer(res))
            .catch(error => console.error("Lỗi khi lấy thông tin answers:", error));
        getAttempt(attemptId)
            .then(res => setAttempt(res))
            .catch(error => console.error("Lỗi khi lấy thông tin attempt", error));
        getReport(attemptId)
            .then(res => {
                setIsReported(res);
                if (res && res.status === "PENDING") {
                    setIsReported(true);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const getUserSelection = (questionId) => {
        const found = answer?.find(a => a.questionId === questionId);
        return found ? found.selectedOptionIds : [];
    };

    if (!data || !answer) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    const handleOpenReportModal = () => {
        setIsModalOpen(true);
    };

    const handleConfirmReport = async (content) => {
        if (!content.trim()) {
            toast.error("Vui lòng nhập nội dung báo cáo!");
            return;
        }

        const reportPayload = {
            attemptId: attempt.id,
            examId: attempt.examId,
            startTime: attempt?.startedAt,
            message: content,
            status: "PENDING"
        };

        try {
            await sendReport(reportPayload);

            setIsReported(true);
            setIsModalOpen(false);
            toast.success("Đã ghi nhận báo cáo, chúng tôi sẽ xử lý trong 24h!");
        } catch (error) {
            console.error("Lỗi khi gửi báo cáo:", error);
            toast.error("Gửi báo cáo thất bại, vui lòng thử lại sau.");
        }
    };

    return (
        <div className="review-page">
            <Navbar/>
            <BackButton navigate={navigate} path="/review"/>
            <Link
                to={`/exam/snapshot/${attemptId}`}
                className="btn-fixed-right btn-snapshot-pos"
            >
                📸 Exam Snapshot
            </Link>
            <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                🏆 Điểm số: <span style={{ color: '#2ecc71' }}>{attempt?.totalScore}</span>
            </p>
            <button
                className={`btn-fixed-right btn-report-pos ${isReported ? "disabled" : ""}`}
                onClick={handleOpenReportModal}
                disabled={isReported}
            >
                {isReported ? "✅ Đã báo cáo" : "🚨🚨 Report"}
            </button>
            <div className="review-container">

                <div className="questions-list">
                    {data?.exams?.examQuestions?.map((item, index) => {
                        const q = item.question;
                        const userSelectedIds = getUserSelection(q.id);

                        return (
                            <div key={q.id} className="question-card">
                                <div className="q-title">
                                    <strong>Câu {index + 1}:</strong>
                                    <MarkDownView content={q.content}/>
                                </div>

                                <div className="options-container">
                                    {q.answers?.map((opt) => {
                                        const isCorrect = opt.correct;
                                        const isUserSelected = userSelectedIds.includes(opt.id);

                                        let optionClass = "option-item";
                                        if (isCorrect) optionClass += " correct";
                                        if (isUserSelected && !isCorrect) optionClass += " incorrect";

                                        return (
                                            <div key={opt.id} className={optionClass}>
                                                <span className="icon">
                                                    {isCorrect ? "✓" : isUserSelected ? "✕" : ""}
                                                </span>
                                                <span className="text">{opt.content}</span>
                                                {isUserSelected && <span className="label-user">(Bạn chọn)</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleConfirmReport}
            />
        </div>
    );
}