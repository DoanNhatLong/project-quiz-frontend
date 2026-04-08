import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";

let stompClient = null;


export const connectSocket = (onMessage) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://quiz-backend-v1.onrender.com';

    if (!baseURL) {
        console.error("❌ Không tìm thấy API URL trong biến môi trường!");
        return;
    }

    const socketUrl = `${baseURL}/ws`;
    console.log("🔗 Kết nối Socket tới:", socketUrl);
    stompClient = new Client({
        // Nếu dùng SockJS, bạn cần bọc nó trong một function webSocketFactory
        webSocketFactory: () => new SockJS(`${socketUrl}`),

        // Debug log (có thể xóa khi chạy production)
        debug: (str) => console.log(str),

        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
        console.log("✅ Connected WebSocket: " + frame);

        // Subscribe vào topic
        stompClient.subscribe("/topic/test", (msg) => {
            if (msg.body) {
                onMessage(JSON.parse(msg.body));
            }
        });
    };

    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    stompClient.activate(); // Kích hoạt kết nối
};

export const sendMessage = (msg) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: "/app/hello",
            body: JSON.stringify(msg)
        });
    } else {
        console.error("❌ STOMP client is not connected.");
    }
};