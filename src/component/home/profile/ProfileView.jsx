import React from "react";
import { useNavigate } from 'react-router-dom';
import './css/ProfileView.css';

const ProfileView = ({ user, avatarUrl, preview }) => {
    const navigate = useNavigate();

    return (
        <div className="profile-wrapper">
            <section className="nes-container is-with-title is-centered avatar-section">
                <p className="title" style={{ fontSize: "1.2rem" }}>Avatar</p>
                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px 0" }}>
                    <div className="avatar-pixel-border">
                        <img
                            src={preview || avatarUrl}
                            alt="Profile"
                            className="avatar-img"
                        />
                    </div>
                </div>
            </section>

            {/* Section Attributes */}
            <section className="nes-container is-with-title attributes-section">
                <p className="title" style={{ fontSize: "1.2rem" }}>Attributes</p>
                <div style={{ flex: 1 }}>
                    <table className="nes-table is-bordered is-dark" style={{ width: "100%" }}>
                        <tbody>
                        <tr>
                            <td style={{ width: "40%" }}><i className="ra ra-health"></i> NAME</td>
                            <td style={{ color: "#f7d51d" }}>{user.name || user.username}</td>
                        </tr>
                        <tr>
                            <td><i className="ra ra-wifi"></i> EMAIL</td>
                            <td style={{ color: "#209cee" }}>{user.email}</td>
                        </tr>
                        <tr>
                            <td><i className="ra ra-player-king"></i> EXP</td>
                            <td style={{ color: "#e76e55" }}>{user.xp} XP</td>
                        </tr>
                        <tr>
                            <td><i className="ra ra-gold-bar"></i> POINTS</td>
                            <td style={{ color: "#92cc41" }}>{user.point || 0} PTS</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="button-group">
                    <button
                        onClick={() => navigate('edit')}
                        type="button"
                        className="nes-btn is-warning"
                        style={{ flex: 1 }}
                    >
                        <i className="ra ra-cog"></i> EDIT
                    </button>
                    <button
                        onClick={() => navigate('history')}
                        type="button"
                        className="nes-btn is-success"
                        style={{ flex: 1 }}
                    >
                        <i className="ra ra-book"></i> HISTORY
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ProfileView;