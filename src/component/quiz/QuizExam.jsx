import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsForPlay, submitQuizResult } from '../../service/quizService';
import { toast } from 'react-toastify';
import Navbar from "../common/Navbar.jsx";
import './css/QuizPlay.css';
import MarkDownView from "../../utils/MarkDownView.jsx";

export default function QuizExam() {
    const { quizId, attemptId,level } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(300);

    const handleSubmit = useCallback(async (reason = "Tự nguyện nộp bài") => {
        // Xóa thời gian đã lưu để không bị tự động nộp lại khi quay lại
        localStorage.removeItem(`quiz_end_time_${attemptId}`);

        try {
            const submission = {
                attemptId: Number(attemptId),
                answers: questions.reduce((acc, q) => {
                    acc[q.id] = selectedAnswers[q.id] || [];
                    return acc;
                }, {})
            };

            const response = await submitQuizResult(submission);

            if (reason !== "Tự nguyện nộp bài") {
                toast.warning(`Hệ thống đã tự động thu bài: ${reason}`);
            } else {
                toast.success("Nộp bài thành công!");
            }
            navigate(`/quiz-finished/${attemptId}`, {
                state: {
                    resultData: response,
                    isFreshSubmit: true,
                    quizLevel: Number(level)
                }
            });

        } catch (error) {
            console.error("Lỗi nộp bài:", error);
            toast.error("Không thể kết nối máy chủ để nộp bài!");
        }
    }, [attemptId, selectedAnswers, questions, navigate, level]);

    useEffect(() => {
        const loadQuizData = async () => {
            try {
                const data = await getQuestionsForPlay(quizId);
                if (!data || data.length === 0) {
                    toast.warn("Không có dữ liệu câu hỏi!");
                    navigate(-1);
                    return;
                }
                setQuestions(data);

                const savedEndTime = localStorage.getItem(`quiz_end_time_${attemptId}`);
                let remaining;

                if (savedEndTime) {
                    remaining = Math.floor((parseInt(savedEndTime) - Date.now()) / 1000);
                } else {
                    const newEndTime = Date.now() + (5 * 60 * 1000); // 5 phút
                    localStorage.setItem(`quiz_end_time_${attemptId}`, newEndTime.toString());
                    remaining = 300;
                }

                if (remaining <= 0) {
                    handleSubmit("Hết thời gian làm bài");
                } else {
                    setTimeLeft(remaining);
                    setLoading(false);
                }
            } catch (error) {
                toast.error("Lỗi tải dữ liệu!");
                console.log(error)
                navigate(-1);
            }
        };
        loadQuizData();
    }, [quizId, attemptId, navigate]);

    // Bộ đếm thời gian
    useEffect(() => {
        if (loading || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit("Hết thời gian làm bài");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, timeLeft]);

    const handleOptionClick = (questionId, answerId, type) => {
        setSelectedAnswers(prev => {
            const current = prev[questionId] || [];
            if (type === 'single') return { ...prev, [questionId]: [answerId] };
            return {
                ...prev,
                [questionId]: current.includes(answerId)
                    ? current.filter(i => i !== answerId)
                    : [...current, answerId]
            };
        });
    };

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

    const currentQ = questions[currentStep];
    const userChoice = selectedAnswers[currentQ?.id] || [];

    return (
        <div className="quiz-play-page">
            <Navbar />
            <div className="quiz-main-container">
                <div className="quiz-header">
                    <div className="progress-container">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                    <div className="quiz-info-row">
                        <span>Câu {currentStep + 1} / {questions.length}</span>
                        <span className={`timer-display ${timeLeft < 60 ? 'urgent' : ''}`}>
                            ⏱ {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                <div className="question-box">
                    <div className="question-meta">
                        <span className={`type-tag ${currentQ.type}`}>
                            {currentQ.type === 'single' ? '✦ Chọn 1' : '✦ Chọn nhiều'}
                        </span>
                    </div>
                    <div className="question-text">
                        <MarkDownView content={currentQ.content} />
                    </div>

                    <div className="options-grid">
                        {currentQ.answers?.map((ans) => (
                            <div
                                key={ans.id}
                                className={`option-card ${userChoice.includes(ans.id) ? 'active' : ''}`}
                                onClick={() => handleOptionClick(currentQ.id, ans.id, currentQ.type)}
                            >
                                <div className="indicator">{userChoice.includes(ans.id) ? '●' : '○'}</div>
                                <span className="option-content">{ans.content}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="quiz-footer">
                    <button
                        className="nes-btn"
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        disabled={currentStep === 0}
                    >
                        Quay lại
                    </button>

                    {currentStep === questions.length - 1 ? (
                        <button className="nes-btn is-primary" onClick={() => handleSubmit()}>Nộp bài</button>
                    ) : (
                        <button className="nes-btn is-success" onClick={() => setCurrentStep(prev => prev + 1)}>Tiếp theo</button>
                    )}
                </div>
            </div>
        </div>
    );
}