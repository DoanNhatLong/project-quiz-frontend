import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

export const connectSocket = (onMessage) => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log("✅ Connected WebSocket");

        stompClient.subscribe("/topic/test", (msg) => {
            onMessage(JSON.parse(msg.body));
        });
    });
};

export const sendMessage = (msg) => {
    stompClient.send("/app/hello", {}, JSON.stringify(msg));
};