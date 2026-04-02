import {useNavigate, useParams} from "react-router-dom";
import Navbar from "../common/Navbar.jsx";
import {useEffect, useState} from "react";
import {getSnapshot} from "../../service/userService.js";
import {BackButton} from "../../utils/Back.jsx";
import "./css/ChallengerSnapshot.css";

export default function ChallengerSnapshot() {
    const { attemptId } = useParams();
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getSnapshot(attemptId)
            .then(snapshotData => {
                const parsedData = typeof snapshotData === 'string' ? JSON.parse(snapshotData) : snapshotData;
                setData(parsedData);
            })
            .catch(error => {
                console.error("Lỗi khi lấy snapshot:", error);
            });
    }, [attemptId]);

    if (!data) return <div className="loading">Đang tải dữ liệu...</div>;

    return (
        <div className="review-page">
            <Navbar />
            <div className="navigation-bar">
                <BackButton navigate={navigate} path={-1} />
            </div>

            <div className="review-container">
                <div className="review-header">
                    <h1>📸 Exam Snapshot</h1>
                    <p>Dữ liệu đề thi gốc được lưu tại thời điểm làm bài</p>
                </div>

                <div className="questions-list">
                    {data.map((item, index) => (
                        <div key={item.question_id || index} className="question-card">
                            <div className="q-title">
                                <strong>Câu {index + 1}:</strong>
                                <div>{item.content}</div>
                            </div>

                            <div className="options-container">
                                {item.answers.map((ans) => (
                                    <div key={ans.answer_id} className="option-item">
                                        <span className="icon">○</span>
                                        <span className="text">{ans.answer}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}