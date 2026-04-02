import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getQuizAttemptDetails} from "../../service/quizService.js";
import Navbar from "../common/Navbar.jsx";
import "./css/QuizReview.css";
import MarkDownView from "../../utils/MarkDownView.jsx";

export default function QuizReview() {
    const {attemptId} = useParams();
    const [reviewData, setReviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const data = await getQuizAttemptDetails(attemptId);
                setReviewData(data);
            } catch (err) {
                console.error("Lỗi:", err);
            } finally {
                setLoading(false);
            }
        };

        if (attemptId) fetchReview();
    }, [attemptId]);

    if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

    // Logic xử lý: Nhóm các bản ghi theo ID câu hỏi
    const groupedQuestions = reviewData ? reviewData.reduce((acc, curr) => {
        const qId = curr.question.id;
        if (!acc[qId]) {
            acc[qId] = {
                question: curr.question,
                selectedAnswerIds: [],
                isCorrect: true
            };
        }
        acc[qId].selectedAnswerIds.push(curr.answer.id);
        if (curr.isCorrect === false) acc[qId].isCorrect = false;
        return acc;
    }, {}) : {};

    const questionsList = Object.values(groupedQuestions);

    return (
        <div className="review-page">
            <Navbar/>
            <div className="review-content">
                <div className="questions-container">
                    {questionsList.map((item, index) => (
                        <div key={item.question.id}
                             className={`question-card ${item.isCorrect ? 'border-correct' : 'border-wrong'}`}>
                            <div className="question-header">
                                <span className="question-index">Câu {index + 1}:</span>
                                <span className={`status-text ${item.isCorrect ? 'text-success' : 'text-danger'}`}>
                                    {item.isCorrect ? 'ĐÚNG' : 'SAI'}
                                </span>
                            </div>

                            <div className="question-body">
                              <MarkDownView content={ item.question.content}/>
                            </div>

                            <div className="answers-list">
                                {item.question.answers.map(ans => {
                                    const isChosen = item.selectedAnswerIds.includes(ans.id);
                                    const isCorrectAns = ans.correct;

                                    return (
                                        <div key={ans.id} className={`answer-item ${isChosen ? 'chosen' : ''}`}>
        <span className="checkbox-sim">
            {isChosen ? (
                isCorrectAns ? <span style={{color: '#2ecc71'}}>✔</span> : <span style={{color: '#e74c3c'}}>✘</span>
            ) : (
                isCorrectAns ? <span style={{color: '#2ecc71', opacity: 0.6}}>●</span> : <span>○</span>
            )}
        </span>
                                            <span className={`answer-text ${isCorrectAns ? 'highlight-correct' : ''}`}>
            {ans.content}
        </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}