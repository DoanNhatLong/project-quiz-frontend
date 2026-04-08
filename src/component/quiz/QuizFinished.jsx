import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import Navbar from "../common/Navbar.jsx";
import {userService} from "../../service/userService.js";
import {useDispatch} from "react-redux";
import {updateXp} from "../../redux/userSlice.js";

export default function QuizFinished() {
    const {attemptId: quizAttemptId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const {resultData, isFreshSubmit, quizLevel, language} = location.state || {};
    const [showReward, setShowReward] = useState(false);
    const [xpStatus, setXpStatus] = useState("");

    useEffect(() => {
        if (isFreshSubmit && quizLevel && resultData?.correct >= 7) {
            navigate(window.location.pathname, {
                replace: true,
                state: { ...location.state, isFreshSubmit: false }
            });
            const xpToAdd = quizLevel * 10;
            console.log(xpToAdd)
            userService.addXp({
                quizAttemptsId: Number(quizAttemptId),
                xp: quizLevel * 10
            }).then(data => {
                dispatch(updateXp(xpToAdd));
                setShowReward(true);
                setXpStatus(`+${quizLevel * 10} XP`);
                console.log(data);
            }).catch(err => {
                console.error("Lỗi khi thêm XP:", err);
            });
        }
    }, [isFreshSubmit, quizLevel, resultData, quizAttemptId]);

    if (!resultData) {
        return (
            <div className="quiz-finished-container">
                <div className="nes-container is-error is-centered">
                    <p className="nes-text is-error">LỖI: DỮ LIỆU TRỐNG!</p>
                    <button onClick={() => navigate('/')} className="nes-btn is-primary">TRANG CHỦ</button>
                </div>
            </div>
        );
    }

    const {correct, total, score} = resultData;
    const isPass = correct >= 7;
    const statusClass = isPass ? "is-success" : "is-error";
    const character = isPass ? "nes-ash" : "nes-ghost";

    return (
        <>
            <Navbar/>
            <div className="quiz-finished-container">

                <section className={`nes-container with-title is-centered ${statusClass} arcade-card`}>
                    <p className={`title arcade-title ${isPass ? 'blink-green' : 'blink-red'}`}>
                        MISSION {isPass ? "COMPLETE" : "FAILED"}
                    </p>

                    <div className="status-visual">
                        <i className={`${character} is-large`}></i>
                    </div>

                    <h2 className="nes-text is-primary title-label">KẾT QUẢ CUỐI CÙNG</h2>

                    <div className="nes-container is-rounded is-dark score-panel">
                        <p>ĐÚNG: <span className="nes-text is-success">{correct}</span> / {total}</p>
                        <p>SCORE: <span className="nes-text is-warning">{(score * 100).toFixed(0)}%</span></p>
                    </div>

                    {showReward && (
                        <div className="reward-section">
                            <button
                                onClick={() => alert("Mở gói quà may mắn thành công!")}
                                className="gift-btn"
                                title="Bấm để nhận quà!"
                            >
                                <i className="nes-icon trophy is-large"></i>
                            </button>
                        </div>
                    )}

                    <div className="rank-box">
                        <p className={`nes-text ${statusClass} is-medium`}>
                            {isPass ? "Chúc mừng bạn đã hoàn thành thử thách!" : "Oops - Bạn đã bị hạ gục"}
                        </p>
                    </div>

                    <div className="quiz-finished-buttons">
                        <button onClick={() => navigate(`/quiz/${language}`)} className="nes-btn">
                            THỬ LẠI
                        </button>
                        <button onClick={() => navigate(`/quiz-review/${quizAttemptId}`)}
                                className="nes-btn is-primary">
                            CHI TIẾT
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}