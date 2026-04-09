import {useNavigate, useParams} from "react-router-dom";
import {
    calculateScore,
    createSnapshot,
    getChallengerExam,
    getTempAnswer,
    tempExam
} from "../../service/adminService.js";
import {useApi} from "../../hooks/useApi.jsx";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useSelector} from "react-redux";
import "./css/ChallengerStart.css";
import {useProgressSaver} from "../../hooks/useProgressSaver.jsx";
import {toast} from "react-toastify";
import MarkDownView from "../../utils/MarkDownView.jsx";
import Swal from "sweetalert2";

export default function ChallengerStart() {
    const params = useParams();
    const examId = params.examId;
    const apiCall = useMemo(() => () => getChallengerExam(examId), [examId]);
    const {data: challengeInfo} = useApi(apiCall, []);
    const user = useSelector((state) => state.user.data);
    const hasSnapshot = useRef(false);
    const [userAnswers, setUserAnswers] = useState({})
    const [flaggedQuestions, setFlaggedQuestions] = useState({});
    const {trackProgress} = useProgressSaver(params.attemptId);
    const navigate = useNavigate();
    const isRestored = useRef(false);
    const [secondsLeft, setSecondsLeft] = useState(300);

    const handleForceSubmit = useCallback(async () => {
        let data = [];
        for (let qId in userAnswers) {
            let answer = userAnswers[qId];
            if (answer !== undefined && answer !== null) {
                data.push({
                    questionId: Number(qId),
                    selectedOptionIds: Array.isArray(answer) ? answer : [answer]
                });
            }
        }

        const finalPayload = { attemptId: String(params.attemptId), data: data };
        try {
            toast.warning("Hết giờ làm bài! Hệ thống tự động nộp...");
            await tempExam(finalPayload);
            await calculateScore(params.attemptId);
            navigate(`/challenger/result/${params.attemptId}`, { replace: true });
        } catch (err) {
            navigate(`/home`);
            console.log(err);
        }
    }, [userAnswers, params.attemptId, navigate]); // Thêm dependencies

// 2. Cập nhật useEffect cho Socket
    useEffect(() => {
        if (secondsLeft === null) return;

        if (secondsLeft <= 0) {
            handleForceSubmit();
            return;
        }

        const timer = setInterval(() => {
            setSecondsLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer); // Cleanup khi unmount
    }, [secondsLeft, handleForceSubmit]);

    const formatTime = (s) => {
        if (s === null) return "Đang khởi tạo...";
        if (s <= 0) return "00:00";
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const questions = useMemo(() => {
        if (!challengeInfo) return [];

        return challengeInfo.reduce((acc, item) => {
            const existingQuestion = acc.find(q => q.question_id === item.question_id);
            const answerObj = {
                answer: item.answer,
                answer_id: item.answer_id
            };
            if (existingQuestion) {
                existingQuestion.answers.push(answerObj);
            } else {
                acc.push({
                    question_id: item.question_id,
                    content: item.content,
                    type: item.type,
                    answers: [answerObj]
                });
            }
            return acc;
        }, []);
    }, [challengeInfo]);


    useEffect(() => {
        const restoreProgress = async () => {
            // eslint-disable-next-line react-hooks/immutability
            if (questions.length === 0 || !params.attemptId || isRestored.current) return;

            try {
                const savedData = await getTempAnswer(params.attemptId);

                const restoredState = {};

                savedData.forEach(item => {
                    const qId = item.questionId;
                    const optIds = item.selectedOptionIds;

                    const question = questions.find(q => q.question_id === qId);

                    if (question) {
                        if (question.type === 'multiple') {
                            restoredState[qId] = optIds;
                        } else {
                            restoredState[qId] = optIds[0];
                        }
                    }
                });

                setUserAnswers(restoredState);
                isRestored.current = true;
                console.log("Đã khôi phục tiến độ làm bài từ server");

            } catch (err) {
                console.error("Lỗi khôi phục tiến độ:", err);
            }
        };

        restoreProgress();
    }, [questions, params.attemptId]);

    const handleSelect = (questionId, answerId, type) => {
        setUserAnswers(prev => {
            let updatedEntry;

            if (type === 'multiple') {
                const currentAnswers = prev[questionId] || [];
                updatedEntry = currentAnswers.includes(answerId)
                    ? currentAnswers.filter(id => id !== answerId)
                    : [...currentAnswers, answerId];
            } else {
                updatedEntry = answerId;
            }

            const answerData = {
                questionId: questionId,
                selectedOptionIds: Array.isArray(updatedEntry) ? updatedEntry : [updatedEntry]
            };

            trackProgress(answerData);

            return {...prev, [questionId]: updatedEntry};
        });
    };
    const handleRightClick = (e, questionId) => {
        e.preventDefault();
        setFlaggedQuestions(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };


    useEffect(() => {
        if (questions.length > 0 && user?.id && !hasSnapshot.current) {
            const payload = {
                examId: examId,
                userId: user.id,
                data: questions
            };
            createSnapshot(payload)
                .then(() => {
                    console.log("✅ Snapshot created successfully");
                    hasSnapshot.current = true;
                })
                .catch(err => {
                    console.error("❌ Lỗi khi tạo snapshot:", err);
                });
        }
    }, [questions, user, examId]);

    const handleSubmit = async () => {
        let data = [];

        for (let qId in userAnswers) {
            let answer = userAnswers[qId];

            if (answer !== undefined && answer !== null) {
                data.push({
                    questionId: Number(qId),
                    selectedOptionIds: Array.isArray(answer) ? answer : [answer]
                });
            }
        }

        if (data.length === 0) {
            toast.error("Bạn chưa làm câu nào!");
            return;
        }

        Swal.fire({
            title: 'Xác nhận nộp bài?',
            text: "Bạn có chắc chắn muốn nộp bài thi này không?",
            showCancelButton: true,
            confirmButtonText: 'Nộp bài',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const finalPayload = {
                    attemptId: String(params.attemptId),
                    data: data
                };

                try {
                    await tempExam(finalPayload);
                    await calculateScore(params.attemptId);
                    navigate(`/challenger/result/${params.attemptId}`, {replace: true});
                    toast.success("Nộp bài thành công");

                } catch (err) {
                    console.error("Lỗi khi nộp bài:", err.response?.data);
                    toast.error("Có lỗi xảy ra khi nộp bài!");
                }
            }
        });
    };

    return (
        <div className="exam-wrapper">
            <div className="exam-content">
                <div className="exam-header">
                    <p className="timer">
                        Thời gian còn lại: <strong style={{color: secondsLeft < 60 ? 'red' : 'black'}}>
                        {formatTime(secondsLeft)}
                    </strong>
                    </p>
                    <p>Thí sinh: <strong>{user?.username}</strong></p>
                </div>

                <div className="questions-container">
                    {questions.map((q, index) => (
                        <div
                            key={q.question_id}
                            id={`q-${index}`}
                            className={`question-card ${flaggedQuestions[q.question_id] ? 'is-flagged-bg' : ''}`}
                            onContextMenu={(e) => handleRightClick(e, q.question_id)}
                        >
                            <div className="question-title">
                                <span className="q-number">Câu {index + 1}:</span>
                                <span className="q-text">
                                 <MarkDownView content={q.content}/>
                                </span>
                            </div>

                            <div className="answers-group">
                                {q.answers.map((ans, i) => {
                                    const isChecked = q.type === 'multiple'
                                        ? userAnswers[q.question_id]?.includes(ans.answer_id)
                                        : userAnswers[q.question_id] === ans.answer_id;

                                    return (
                                        <label key={i} className={`answer-item ${isChecked ? 'selected' : ''}`}>
                                            <input
                                                type={q.type === 'multiple' ? 'checkbox' : 'radio'}
                                                name={`group-${q.question_id}`}
                                                checked={!!isChecked}
                                                onChange={() => handleSelect(q.question_id, ans.answer_id, q.type)}
                                            />
                                            <span className="ans-text">{ans.answer}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* BÊN PHẢI: BẢNG ĐIỀU KHIỂN */}
            <div className="exam-sidebar">
                <div className="sidebar-sticky">
                    <h3>Tiến độ làm bài</h3>
                    <div className="status-grid">
                        {questions.map((q, index) => {
                            const isDone = !!userAnswers[q.question_id];
                            const isFlagged = flaggedQuestions[q.question_id];

                            let statusClass = "";
                            if (isFlagged) statusClass = "status-flagged";
                            else if (isDone) statusClass = "status-done";

                            return (
                                <a
                                    key={index}
                                    href={`#q-${index}`}
                                    className={`status-item ${statusClass}`}
                                    onContextMenu={(e) => handleRightClick(e, q.question_id)}
                                >
                                    {index + 1}
                                </a>
                            );
                        })}
                    </div>

                    <div className="legend">
                        <div className="legend-item"><span className="box done"></span> Đã làm</div>
                        <div className="legend-item"><span className="box flagged"></span> Nghi ngờ (Chuột phải)
                        </div>
                        <div className="legend-item"><span className="box pending"></span> Chưa làm</div>
                    </div>

                    <button className="btn-submit" onClick={handleSubmit}>
                        NỘP BÀI THI
                    </button>
                </div>
            </div>
        </div>
    );
}