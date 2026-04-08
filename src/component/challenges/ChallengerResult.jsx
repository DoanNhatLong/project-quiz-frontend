import {useNavigate, useParams} from "react-router-dom";
import {useMemo} from "react";
import api from "../../api/axios.js";
import {useApi} from "../../hooks/useApi.jsx";
import {BackButton} from "../../utils/Back.jsx";
import "./css/ChallengerResult.css"
import Navbar from "../common/Navbar.jsx";

export default function ChallengerResult() {
    const params = useParams();
    const attemptId = params.attemptId;
    const navigate = useNavigate();
    const apiCall = useMemo(() => {
        return () =>
            // api.get(`/users/scores/${attemptId}`);
            api.get(`/users/result/${attemptId}`);
    }, [attemptId]);
    const {data} = useApi(apiCall, [attemptId]);
    return (
        <div className="challenger-result-page">
            <Navbar />
            {/* Container chính để quản lý nút Back và Nội dung độc lập */}
            <div className="result-layout">
                <div className="back-button-area">
                    <BackButton navigate={navigate} path="/home" />
                </div>

                <div className="result-content">
                    {data?.data ? (
                        <div className={`result-card ${data.data.isPassed ? 'passed' : 'failed'}`}>
                            <div className="icon-box">{data.data.isPassed ? '🎉' : '😢'}</div>
                            <div className="status-text">{data.data.isPassed ? 'CHÚC MỪNG' : 'CHIA BUỒN'}</div>
                            <div className="score-text">Điểm số đạt được</div>
                            <div className="score-number">{data.data.totalScore}/100</div>
                        </div>
                    ) : (
                        <p>Đang tải kết quả...</p>
                    )}
                </div>
            </div>
        </div>
    );
}