import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import md5 from "md5";
import Navbar from "../common/Navbar.jsx";
import ProfileView from "./profile/ProfileView.jsx";
import ProfileEdit from "./profile/ProfileEdit.jsx";
import ProfileHistory from "./profile/ProfileHistory.jsx";
import {useSelector} from "react-redux";


export default function Profile() {
    const user = useSelector((state) => state.user.data);
    const [preview, setPreview] = useState(null);

    if (!user) return <div className="nes-text is-error">Loading...</div>;

    const avatarUrl = `https://www.gravatar.com/avatar/${md5(user.email.trim().toLowerCase())}?d=identicon&s=150`;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#e7ebf3" }}>
            <Navbar />
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                <div style={{ width: "100%", maxWidth: "1000px" }}>
                    <Routes>
                        <Route index element={
                            <ProfileView
                                user={user}
                                avatarUrl={avatarUrl}
                                handleFileChange={handleFileChange}
                                preview={preview}
                            />
                        } />
                        <Route path="edit" element={<ProfileEdit />} />
                        <Route path="history" element={<ProfileHistory />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}