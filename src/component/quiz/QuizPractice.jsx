import Navbar from "../common/Navbar.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {toast} from "react-toastify";
import api from "../../api/axios.js";
import {BackButton} from "../../utils/Back.jsx";

export default function QuizPractice() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const language = searchParams.get('language');
    const level = searchParams.get('level');
    const [quizList, setQuizList] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        api.get("/quizzes/practice", {
            params: {
                language: language,
                level: level
            }
        })
            .then(response => {
                setQuizList(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [language, level]);
    const handleStartExam = async (quizId) => {
        if (!user.id) {
            toast.error("Không tìm thấy thông tin người dùng!");
            return;
        }

        try {
            const response = await api.post("/quiz-attempts/start", {
                quizId: quizId,
                userId: user.id
            });

            const attemptId = response.data.id;
            navigate(`/quiz-exam/${quizId}/${attemptId}/${level}`);

        } catch (error) {
            console.error(error);
            toast.error("Lỗi khởi tạo lượt làm bài!");
        }
    };

    return (
        <>
            <Navbar />
            <BackButton navigate={navigate} path="/"/>
            <div className="container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                <h2 className="nes-text is-primary" style={{ textAlign: 'center', marginBottom: '30px' }}>
                    {language?.toUpperCase()} MISSIONS - LV {level}
                </h2>

                <div className="mission-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {quizList && quizList.map((quiz) => (
                        <div key={quiz.id} className="nes-container is-rounded with-title is-dark">
                            <p className="title">{quiz.title}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>{quiz.description}</p>
                                    <span className="nes-text is-success" style={{ fontSize: '0.8rem' }}>
                                        Target: {Math.round(quiz.passScore * 100)}%
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="nes-btn is-primary"
                                    onClick={() => handleStartExam(quiz.id)}
                                >
                                    START
                                </button>
                            </div>
                        </div>
                    ))}

                    {quizList && quizList.length === 0 && (
                        <p className="nes-text is-error">No missions available for this level.</p>
                    )}
                </div>
            </div>
        </>
    );
}