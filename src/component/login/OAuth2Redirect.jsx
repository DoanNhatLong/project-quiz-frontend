import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import {setUser} from "../../redux/userSlice.js";

const OAuth2Redirect = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Lấy token từ URL thanh địa chỉ
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            // Gọi API lấy thông tin User từ Backend
            api.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    // Hợp nhất data User + Token rồi ném vào Redux
                    const fullData = { ...res.data, token };
                    dispatch(setUser(fullData));

                    // Sau khi xong xuôi thì về Home
                    navigate("/home");
                })
                .catch(err => {
                    console.error("Lỗi xác thực:", err);
                    navigate("/login");
                });
        }
    }, [dispatch, navigate]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Đang xác thực tài khoản Google...</h2>
        </div>
    );
};

export default OAuth2Redirect;