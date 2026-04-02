import { useState } from 'react'
import { userService } from "../../service/userService.js"
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"
import {useDispatch} from "react-redux";
import {setUser} from "../../redux/userSlice.js";

export default function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSubmit = () => {
        // Kiểm tra dữ liệu đầu vào cơ bản
        if (!username || !password) {
            toast.warn("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        userService.loginUser({ username, password })
            .then(res => {
                const data = res.data; // Đây là Object Map.of từ Java bạn viết lúc nãy

                // --- BƯỚC QUAN TRỌNG: LƯU TOKEN VÀO LOCALSTORAGE ---
                localStorage.setItem('token', data.token);
                // Lưu thêm info user dạng chuỗi để dùng khi F5 trang
                localStorage.setItem('user', JSON.stringify(data));

                // Lưu vào Redux để các component khác (RightSide, Header) cập nhật ngay lập tức
                dispatch(setUser(data));

                toast.success("Chào mừng Adventurer trở lại!");
                navigate('/home');
            })
            .catch(err => {
                console.error("Login Error:", err);
                const errorMsg = err.response?.data || "Sai tên đăng nhập hoặc mật khẩu!";
                toast.error(typeof errorMsg === 'string' ? errorMsg : "Lỗi đăng nhập!");
            });
    }

    const inputStyle = {
        border: '2px solid #111',
        padding: '12px 14px',
        fontSize: '15px',
        outline: 'none',
        fontFamily: "'Courier New', monospace",
        width: '100%',
        boxSizing: 'border-box'
    }

    const labelStyle = {
        fontSize: '15px',
        fontWeight: '600',
        color: '#374151',
        fontFamily: "'Courier New', monospace"
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={labelStyle}>Tên đăng nhập</label>
                <input
                    type="text"
                    placeholder="Nhập tên đăng nhập..."
                    style={inputStyle}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={labelStyle}>Mật khẩu</label>
                <input
                    type="password"
                    placeholder="Nhập mật khẩu..."
                    style={inputStyle}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button
                onClick={handleSubmit}
                style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: '2px solid #111',
                    padding: '14px',
                    fontSize: '16px',
                    fontWeight: '700',
                    fontFamily: "'Courier New', monospace",
                    boxShadow: '4px 4px 0 #111',
                    cursor: 'pointer',
                    width: '100%'
                }}
            >
                Đăng nhập
            </button>
        </div>
    )
}