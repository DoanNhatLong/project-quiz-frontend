import Navbar from "../common/Navbar.jsx";
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {getReview, getSelectAnswer} from "../../service/userService.js";
import MarkDownView from "../../utils/MarkDownView.jsx";
import "./css/ChallengerReview.css"
import {BackButton} from "../../utils/Back.jsx";

export default function ChallengerReview() {
    const [data, setData] = useState(null);
    const [answer, setAnswer] = useState(null);
    const params = useParams();
    const navigate = useNavigate();
    const attemptId = params.challengeId;
    useEffect(() => {
        getReview(attemptId)
            .then(res => setData(res))
            .catch(error => console.error("Lỗi khi lấy thông tin review:", error));

        getSelectAnswer(attemptId)
            .then(res => setAnswer(res))
            .catch(error => console.error("Lỗi khi lấy thông tin answers:", error));
    }, []);

    const getUserSelection = (questionId) => {
        const found = answer?.find(a => a.questionId === questionId);
        return found ? found.selectedOptionIds : [];
    };

    if (!data || !answer) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="review-page">
            <Navbar />
            <BackButton navigate={navigate} path="/review"/>
            <Link
                to={`/exam/snapshot/${attemptId}`}
                className="btn-fixed-right btn-snapshot-pos"
            >
                📸 Exam Snapshot
            </Link>

            <Link
                to={`/exam/report/${attemptId}`}
                className="btn-fixed-right btn-report-pos"
            >
                🚨🚨 Report
            </Link>
            <div className="review-container">

                <div className="questions-list">
                    {data?.exams?.examQuestions?.map((item, index) => {
                        const q = item.question;
                        const userSelectedIds = getUserSelection(q.id);

                        return (
                            <div key={q.id} className="question-card">
                                <div className="q-title">
                                    <strong>Câu {index + 1}:</strong>
                                    <MarkDownView content={q.content} />
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
        </div>
    );
}