import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import "./css/ChallengerWaiting.css";
import { useSelector } from "react-redux";
import {createAttempt, getChallengerById} from "../../service/adminService.js";
import {toast} from "react-toastify";
import {BackButton} from "../../utils/Back.jsx";

export default function ChallengerWaiting() {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.user.data);

    const isAdmin = user?.roles === 'admin';
    const [candidates, setCandidates] = useState([]);
    const [challengeInfo, setChallengeInfo] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");

    const stompClient = useRef(null);

    useEffect(() => {
        if (!isAdmin && !location.state?.isVerified) {
            Swal.fire("Lỗi", "Bạn cần nhập mã để vào phòng!", "error");
            navigate('/challenger');
        }
    }, [isAdmin, location.state, navigate]);

    useEffect(() => {
        getChallengerById(challengeId).then(res => {
            setChallengeInfo(res);
        }).catch(err => console.error("Lỗi lấy thông tin phòng:", err));
    }, [challengeId]);

    useEffect(() => {
        if (!user || (!isAdmin && !location.state?.isVerified)) return;

        // Khởi tạo kết nối SockJS (khớp với registry.addEndpoint("/ws") ở BE)
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = Stomp.over(socket);

        // Connect tới server
        stompClient.current.connect({}, (frame) => {
            console.log("✅ STOMP Connected:", frame);

            stompClient.current.subscribe(`/topic/update_candidates/${challengeId}`, (message) => {
                if (message.body) {
                    const data = JSON.parse(message.body);
                    setCandidates([...data]);
                }
            });

            stompClient.current.subscribe(`/topic/kicked/${challengeId}/${user.id}`, (message) => {
                if (message.body === "KICKED_BY_ADMIN") {
                    Swal.fire({
                        title: "Thông báo",
                        text: "Bạn đã bị Admin mời ra khỏi phòng!",
                        icon: "warning",
                        confirmButtonText: "Đồng ý"
                    }).then(() => {
                        navigate('/challenger'); // Chuyển trang ngay lập tức
                    });
                }
            });

            // 2. Subscribe nhận tín hiệu bắt đầu thi (Nếu sau này BE có thêm logic này)
            stompClient.current.subscribe(`/topic/start_exam/${challengeId}`, (message) => {
                const config = JSON.parse(message.body);
                // eslint-disable-next-line react-hooks/immutability
                handleStartExam(config);
            });

            const joinPayload = {
                challengeId: challengeId,
                userId: user.id,
                username: user.username,
                email: user.email
            };
            stompClient.current.send("/app/join_exam_room", {}, JSON.stringify(joinPayload));

        }, (error) => {
            console.error("❌ STOMP ERROR:", error);
        });

        return () => {
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.disconnect();
                console.log("❌ STOMP Disconnected");
            }
        };
    }, [challengeId, user]);

    const handleStartExam = async (config) => {
        const payload = {
            userId: user.id,
            examId: challengeInfo.examId,
        };

        try {
            const res = await createAttempt(payload);

            const attemptId = res?.id;

            Swal.fire({
                title: 'GIỜ THI ĐÃ ĐẾN!',
                text: 'Hệ thống đang chuyển hướng...',
                timer: 2000,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading()
            });

            setTimeout(() => {
                navigate(`/challenger/${challengeInfo.examId}/${attemptId}/start`, { state: { config } });
            }, 2000);

        } catch (err) {
            toast.error("Bạn đã nộp bài thi này rồi!");
            console.error(err);
            navigate('/home');
            return;
        }
    };

    useEffect(() => {
        if (!challengeInfo?.startTime) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();

            const start = new Date(challengeInfo.startTime).getTime();
            const distance = start - now;

            if (distance <= 0) {
                setTimeLeft("Đang bắt đầu...");
                clearInterval(timer);
            } else {
                const hours = Math.floor(distance / (1000 * 60 * 60));
                const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((distance % (1000 * 60)) / 1000);

                const hourTemplate = hours > 0 ? `${hours}giờ ` : "";
                setTimeLeft(`${hourTemplate}${mins}phút ${secs}giây`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [challengeInfo]);

    const handleKick = (targetUserId, targetUsername) => {
        Swal.fire({
            title: `Kick ${targetUsername}?`,
            text: "Thí sinh này sẽ bị mời ra khỏi phòng chờ!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Kick',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed && stompClient.current) {
                stompClient.current.send("/app/kick_candidate", {}, JSON.stringify({
                    challengeId: challengeId,
                    userId: targetUserId
                }));
            }
        });
    };

    return (
        <div className="waiting-container">
            <BackButton navigate={navigate} path="/challenger" />
            <div className="header-section">
                <h1>Thử thách: {challengeInfo?.title || `#${challengeId}`}</h1>
                <div className="countdown-box">
                    <p>Thời gian bắt đầu: <strong>{new Date(challengeInfo?.startTime).toLocaleString()}</strong></p>
                    <h2 className="timer-text">Bắt đầu sau: {timeLeft}</h2>
                    <button
                        onClick={() => handleStartExam({ testMode: true, manualStart: true })}
                        style={{
                            marginTop: '20px',
                            padding: '12px 24px',
                            backgroundColor: '#ff4757',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        ⚡ VÀO THI NGAY (TEST)
                    </button>
                </div>
            </div>

            <div className="candidate-list-area">
                <h3>Thí sinh đang chờ ({candidates.length})</h3>
                <div className="candidate-grid">
                    {candidates.map((cand, index) => (
                        <div key={cand.userId || index} className="user-card online">
                            <div className="user-info">
                                <strong>{cand.username}</strong>
                                {isAdmin && cand.userId !== user.id && (
                                    <button
                                        className="kick-btn"
                                        onClick={() => handleKick(cand.userId, cand.username)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rules-note">
                <p>⚠️ <strong>Lưu ý quan trọng:</strong></p>
                <ul>
                    <li>Phòng thi này <strong>không cho phép</strong> kết nối lại nếu thoát ra.</li>
                    <li>Đảm bảo đường truyền internet ổn định trước khi bắt đầu.</li>
                </ul>
            </div>
        </div>
    );
}