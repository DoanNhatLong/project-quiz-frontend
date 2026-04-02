import {useParams, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {getExam, getExamQuestions} from "../../../service/adminService.js";
import MarkDownView from "../../../utils/MarkDownView.jsx";
import "./css/ExamDetail.css";

export default function ExamDetail() {
    const {examId} = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const pageRef = useRef(0);
    const observer = useRef(null);

    useEffect(() => {
        getExam(examId)
            .then(res => setExam(res))
            .catch(err => console.error("Lỗi API:", err));
    }, [examId]);

    const loadingRef = useRef(false);

    const loadQuestions = useCallback(() => {
        if (loadingRef.current || !hasMore) return;

        loadingRef.current = true;
        setLoading(true);

        getExamQuestions(examId, pageRef.current)
            .then(data => {
                setQuestions(prev => [...prev, ...data.content]);
                setHasMore(data.page.number < data.page.totalPages - 1);
                pageRef.current += 1;
            })
            .finally(() => {
                loadingRef.current = false;
                setLoading(false);
            });
    }, [examId, hasMore]);

    const lastElementRef = useCallback(node => {

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadQuestions();
            }
        });

        if (node) observer.current.observe(node);
    }, [hasMore, loadQuestions]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuestions([]);
        pageRef.current = 0;
        setHasMore(true);
        loadQuestions();
    }, [examId]);


    if (!exam) return <div className="loading">Đang tải dữ liệu...</div>;

    return (
        <div className="exam-detail-container">
            <header className="exam-header">
                <h1>{exam.title}</h1>
                <div className="exam-info">
                    <span>⏱ Thời gian: {exam.durationMinutes} phút</span>
                    <span>🎯 Điểm đạt: {exam.passScorePercentage * 100}%</span>
                    <span>📝 Tổng số câu: {exam.totalQuestions || questions.length}</span>
                </div>
                <p className="exam-desc">{exam.description}</p>
            </header>

            <div className="questions-list">
                {questions.map((q, index) => {
                    const isLastElement = questions.length === index + 1;

                    return (
                        <>
                            <div
                                key={q.id}
                                className="question-card"
                                ref={isLastElement ? lastElementRef : null}
                            >
                                <div className="question-card-header">
                                    <span className="question-number">Câu hỏi {index + 1}</span>
                                    <div className="header-actions">
                                <span className={`type-badge ${q.type}`}>
                                    {q.type === 'single' ? 'Một đáp án' : 'Nhiều đáp án'}
                                </span>
                                        <button
                                            className="btn-edit-question"
                                            onClick={() => navigate(`/admin/questions/edit/${q.id}/${examId}`)}
                                        >
                                            ✏️ Edit
                                        </button>
                                    </div>
                                </div>

                                <div className="question-content">
                                    <MarkDownView content={q.content}/>
                                </div>

                                <div className="answers-grid">
                                    {q.answers?.map((ans) => (
                                        <div
                                            key={ans.id}
                                            className={`answer-item ${ans.correct ? 'correct' : ''}`}
                                        >
                                            <span className="check-icon">{ans.correct ? "✅" : "⚪"}</span>
                                            <span className="ans-text">{ans.content}</span>
                                        </div>
                                    ))}
                                </div>

                            </div>

                        </>

                    );
                })}
            </div>
            <div className="scroll-status">
                {loading && (
                    <div className="loading-more">
                        <span className="spinner"></span> Đang tải thêm câu hỏi...
                    </div>
                )}

                {!hasMore && questions.length > 0 && (
                    <div className="end-message">
                        ✨ Đã hiển thị tất cả các câu hỏi.
                    </div>
                )}
            </div>

        </div>
    );
}