import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/userSlice.js";
import { toast } from "react-toastify";
import api from "../../../api/axios.js"; // Đảm bảo đã install axios

const ProfileEdit = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Lấy thông tin user hiện tại từ Redux Store
    const user = useSelector((state) => state.user.data);

    // State cho các ô nhập liệu
    const [tempName, setTempName] = useState(user?.username || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        // 1. Validate nhanh tại FE
        if (!oldPassword) {
            toast.warn("Vui lòng nhập mật khẩu cũ để xác thực!");
            return;
        }

        if (newPassword && newPassword.length < 3) {
            toast.error("Mật khẩu mới phải có ít nhất 3 ký tự!");
            return;
        }

        setLoading(true);
        try {
            // 2. Gửi request đến API Update Profile
            const response = await api.put("/users/update-profile", {
                id: user.id,
                username: tempName,
                oldPassword: oldPassword,
                newPassword: newPassword
            });

            const updatedUser = response.data;
            const currentToken = localStorage.getItem('token'); // Lấy lại token đang dùng
            updatedUser.roles = updatedUser.roles?.name || updatedUser.roles;
            updatedUser.token = currentToken;

            dispatch(setUser({
                ...updatedUser,
                token: currentToken
            }));

            localStorage.setItem('user', JSON.stringify({ ...updatedUser, token: currentToken }));

            toast.success("Hành trang đã được cập nhật!");
            navigate('/profile');

        } catch (error) {
            // Lấy message lỗi từ Map.of của Backend gửi về
            const errorMsg = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="nes-container is-with-title" style={{ backgroundColor: "white", padding: "30px" }}>
            <p className="title" style={{ fontSize: "1.5rem" }}>Edit Character</p>

            {/* Input Name */}
            <div className="nes-field" style={{ marginBottom: "20px" }}>
                <label htmlFor="name_field">New Name</label>
                <input
                    type="text"
                    id="name_field"
                    className="nes-input"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                />
            </div>

            {/* Input Old Password */}
            <div className="nes-field" style={{ marginBottom: "20px" }}>
                <label htmlFor="old_pass">Current Password <span style={{color: "red"}}>*</span></label>
                <input
                    type="password"
                    id="old_pass"
                    className="nes-input"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Confirm current password"
                />
            </div>

            {/* Input New Password */}
            <div className="nes-field" style={{ marginBottom: "20px" }}>
                <label htmlFor="new_pass">New Password (Optional)</label>
                <input
                    type="password"
                    id="new_pass"
                    className="nes-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                />
            </div>

            <div style={{ marginTop: "40px", display: "flex", gap: "20px" }}>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    type="button"
                    className={`nes-btn is-primary ${loading ? 'is-disabled' : ''}`}
                    style={{ flex: 1 }}
                >
                    {loading ? "SAVING..." : "SAVE"}
                </button>

                <button
                    onClick={() => navigate(-1)}
                    type="button"
                    className="nes-btn"
                    style={{ flex: 1 }}
                >
                    CANCEL
                </button>
            </div>
        </section>
    );
};

export default ProfileEdit;