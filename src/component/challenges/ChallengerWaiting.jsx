import React, {useState, useEffect, useRef, useCallback} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
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

    const handleStartExam = useCallback(async (config) => {
        const userId = user.id;
        const examId = challengeInfo.examId;
        const challengeId = challengeInfo.id;

        try {
            const res = await createAttempt(examId, userId, challengeId);

            const attemptId = res?.id;

            Swal.fire({
                title: 'GIỜ THI ĐÃ ĐẾN!',
                text: 'Hệ thống đang chuyển hướng...',
                timer: 2000,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading()
            });

            setTimeout(() => {
                navigate(`/challenger/${examId}/${attemptId}/start`, { state: { config } });
            }, 2000);

        } catch (err) {
            toast.error("Bạn đã nộp bài thi này rồi!");
            console.error(err);
            navigate('/home');
            return;
        }
    });


    useEffect(() => {
        if (!user || (!isAdmin && !location.state?.isVerified)) return;

        // Khởi tạo URL chuẩn từ biến môi trường
        const socketUrl = `${import.meta.env.VITE_API_BASE_URL}/ws`;

        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log("✅ STOMP Connected");

                // 1. Subscribe cập nhật danh sách thí sinh
                client.subscribe(`/topic/update_candidates/${challengeId}`, (message) => {
                    if (message.body) {
                        const data = JSON.parse(message.body);
                        setCandidates([...data]);
                    }
                });

                // 2. Subscribe xử lý bị kick
                client.subscribe(`/topic/kicked/${challengeId}/${user.id}`, (message) => {
                    if (message.body === "KICKED_BY_ADMIN") {
                        Swal.fire({
                            title: "Thông báo",
                            text: "Bạn đã bị Admin mời ra khỏi phòng!",
                            icon: "warning",
                            confirmButtonText: "Đồng ý"
                        }).then(() => {
                            navigate('/challenger');
                        });
                    }
                });

                // 3. Subscribe nhận tín hiệu bắt đầu thi
                client.subscribe(`/topic/start_exam/${challengeId}`, (message) => {
                    const config = JSON.parse(message.body);
                    handleStartExam(config);
                });

                // 4. Gửi tín hiệu Join phòng (Dùng publish thay cho send)
                const joinPayload = {
                    challengeId: challengeId,
                    userId: user.id,
                    username: user.username,
                    email: user.email
                };
                client.publish({
                    destination: "/app/join_exam_room",
                    body: JSON.stringify(joinPayload)
                });
            },
            onStompError: (frame) => {
                console.error("❌ STOMP ERROR:", frame);
            }
        });

        client.activate();
        stompClient.current = client;

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
                console.log("❌ STOMP Deactivated");
            }
        };
    }, [challengeId, user, isAdmin, location.state, navigate, handleStartExam]);

   

    useEffect(() => {
        if (!challengeInfo?.startTime) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();

            const start = new Date(challengeInfo.startTime).getTime();
            const distance = start - now;

            if (distance <= 0) {
                setTimeLeft("Đang bắt đầu...");
                clearInterval(timer);
                if (!isAdmin) {
                    handleStartExam({ autoStart: true });
                }
            } else {
                const hours = Math.floor(distance / (1000 * 60 * 60));
                const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((distance % (1000 * 60)) / 1000);

                const hourTemplate = hours > 0 ? `${hours}giờ ` : "";
                setTimeLeft(`${hourTemplate}${mins}phút ${secs}giây`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [challengeInfo, isAdmin]);

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
                // Thay .send bằng .publish
                stompClient.current.publish({
                    destination: "/app/kick_candidate",
                    body: JSON.stringify({
                        challengeId: challengeId,
                        userId: targetUserId
                    })
                });
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
                    {/*<button*/}
                    {/*    onClick={() => handleStartExam({ testMode: true, manualStart: true })}*/}
                    {/*>*/}
                    {/*    VÀO THI NGAY (TEST)*/}
                    {/*</button>*/}
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
                    <li>Đảm bảo <strong>không có ai</strong> vào tài khoản của bạn khi đang thi</li>
                    <li>Đảm bảo đường truyền internet ổn định trước khi bắt đầu.</li>
                </ul>
            </div>
        </div>
    );
}