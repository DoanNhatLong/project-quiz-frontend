import {useNavigate, useParams} from "react-router-dom";
import { getQuestion, updateQuestion } from "../../service/adminService.js";
import { useEffect, useState } from "react";
import "./css/AdminEditQuestion.css";
import {toast} from "react-toastify";

export default function AdminEditQuestion() {
    const { questionId ,examId} = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getQuestion(questionId)
            .then(res => {
                setQuestion(res);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi API:", err);
                setLoading(false);
            });
    }, [questionId]);

    const handleQuestionChange = (e) => {
        setQuestion({ ...question, content: e.target.value });
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...question.answers];
        newAnswers[index].content = value;
        setQuestion({ ...question, answers: newAnswers });
    };

    const handleCorrectChange = (index) => {
        const newAnswers = question.answers.map((ans, i) => ({
            ...ans,
            correct: i === index
        }));
        setQuestion({ ...question, answers: newAnswers });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateQuestion(questionId, question)
            .then(() => {
                toast.success("Cập nhật thành công!");
                navigate(-1);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Lỗi khi cập nhật");
            });

    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (!question) return <p>Không tìm thấy câu hỏi.</p>;

    return (
        <div className="edit-question-container">

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <label className="form-label">Nội dung câu hỏi:</label>
                    <textarea
                        className="question-textarea"
                        value={question.content}
                        onChange={handleQuestionChange}
                        rows="3"
                    />
                </div>

                <div className="form-section">
                    <label className="form-label">Danh sách đáp án (Chọn 1 đáp án đúng):</label>
                    {question.answers.map((ans, index) => (
                        <div key={ans.id || index} className="answer-row">
                            <input
                                type="radio"
                                name="correctAnswer"
                                checked={ans.correct}
                                onChange={() => handleCorrectChange(index)}
                            />
                            <input
                                type="text"
                                className="answer-input"
                                value={ans.content}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                placeholder={`Đáp án ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>

                <div className="button-group">
                    <button type="submit" className="btn-save">Lưu thay đổi</button>
                    <button type="button" onClick={() => window.history.back()} className="btn-cancel">Hủy</button>
                </div>
            </form>
        </div>
    );
}