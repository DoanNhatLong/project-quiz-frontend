import React from 'react';
import {useNavigate} from "react-router-dom";
import api from "../../api/axios.js";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import './css/QuizJS.css';
import Navbar from "../common/Navbar.jsx";
import {BackButton} from "../../utils/Back.jsx";

export default function QuizJava() {
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.data);
    const userExp = user?.xp || 0;

    const levels = [
        {id: 1, name: 'LEVEL 1', requiredExp: 0, guestAccessible: true, image: "src/assets/image/level1.jpg"},
        {id: 2, name: 'LEVEL 2', requiredExp: 100, guestAccessible: false, image: "src/assets/image/level2.jpg"},
        {id: 3, name: 'LEVEL 3', requiredExp: 200, guestAccessible: false, image: "src/assets/image/level3.jpg"},
        {id: 4, name: 'LEVEL 4', requiredExp: 500, guestAccessible: false, image: "src/assets/image/level4.jpg"},
        {id: 5, name: 'LEVEL 5', requiredExp: 1000, guestAccessible: false, image: "src/assets/image/level5.jpg"},
    ];

    const handleStartQuiz = async (quizId) => {
        if (quizId === 1) {
            if (!user) {
                navigate(`/quiz-play/${quizId}/guest`);
                return;
            }
            try {
                const response = await api.post(`/quiz-attempts/start`, {
                    quizId: quizId,
                    userId: user.id
                });
                navigate(`/quiz-play/${quizId}/${response.data.id}`);
            } catch (error) {
                toast.error("Không thể khởi tạo lượt làm bài!");
                console.log(error);
            }
        }
        else {
            navigate(`/quiz-practice?language=JS&level=${quizId}`);
        }

        if (quizId === 6) {
            if (!user) {
                navigate(`/quiz-play/${quizId}/guest`);
                return;
            }
            try {
                const response = await api.post(`/quiz-attempts/start`, {
                    quizId: quizId,
                    userId: user.id
                });
                navigate(`/quiz-play/${quizId}/${response.data.id}`);
            } catch (error) {
                toast.error("Không thể khởi tạo lượt làm bài!");
                console.log(error);
            }
        }
        else {
            navigate(`/quiz-practice?language=Java&level=${quizId}`);
        }

    };

    return (
        <>
            <Navbar/>
            <BackButton navigate={navigate} path="/"/>
            <div className="quiz-js-container">
                <h2 className="nes-text is-primary" style={{textAlign: 'center', marginBottom: '40px'}}>
                    SELECT ADVENTURE
                </h2>

                <div className="levels-grid">
                    {levels.map((lvl) => {
                        const isLocked = !user ? !lvl.guestAccessible : userExp < lvl.requiredExp;

                        const progress = isLocked
                            ? Math.min(Math.round((userExp / lvl.requiredExp) * 100), 100)
                            : 100;

                        return (
                            <div
                                key={lvl.id}
                                className={`nes-container is-rounded with-title level-card ${isLocked ? 'locked' : 'unlocked'}`}
                            >
                                <p className="title" style={{backgroundColor: '#fff'}}>{lvl.name}</p>

                                <div style={{position: 'relative'}}>
                                    <img src={lvl.image} alt={lvl.name} className="level-thumbnail"/>
                                    {isLocked && (
                                        <div className="lock-overlay">
                                            <i className="nes-icon lock is-small"></i>
                                        </div>
                                    )}
                                </div>

                                <div className="unlock-hint">
                                    {isLocked ? (
                                        <>
                                            <span className="nes-text is-error">Locked: {lvl.requiredExp} XP</span>
                                            <progress
                                                className="nes-progress is-error"
                                                value={progress}
                                                max="100"
                                                style={{marginTop: '10px'}}
                                            ></progress>
                                        </>
                                    ) : (
                                        <>
                                            <span className="nes-text is-success">Ready to Quest!</span>
                                            <progress className="nes-progress is-success" value="100" max="100"
                                                      style={{marginTop: '10px'}}></progress>
                                        </>
                                    )}
                                </div>

                                <button
                                    disabled={isLocked}
                                    className={`nes-btn is-fullwidth ${isLocked ? 'is-disabled' : 'is-primary'}`}
                                    onClick={() => handleStartQuiz(lvl.id)}
                                    style={{marginTop: '15px'}}
                                >
                                    {isLocked ? 'LOCKED' : 'START'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}