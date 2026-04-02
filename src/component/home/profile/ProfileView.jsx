import React from "react";
import { useNavigate } from 'react-router-dom';

const ProfileView = ({ user, avatarUrl, handleFileChange, preview }) => {
    const navigate = useNavigate();

    return (
        <div style={{ display: "flex", gap: "30px", alignItems: "stretch" }}>
            <section className="nes-container is-with-title is-centered" style={{
                width: "350px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white"
            }}>
                <p className="title" style={{ fontSize: "1.5rem" }}>Avatar</p>
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        border: "4px solid #000",
                        padding: "5px",
                        background: "#fff",
                        lineHeight: 0,
                        boxShadow: "5px 5px 0px #888"
                    }}>
                        <img
                            src={preview || avatarUrl}
                            alt="Profile"
                            style={{ width: "160px", height: "160px", imageRendering: "pixelated", objectFit: "cover" }}
                        />
                    </div>
                </div>
                <div style={{ padding: "20px 0" }}>
                    <label className="nes-btn is-primary" style={{ cursor: "pointer", width: "100%" }}>
                        <i className="ra ra-camera"></i> <span> UPLOAD</span>
                        <input
                            type="file"
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
            </section>

            <section className="nes-container is-with-title" style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white"
            }}>
                <p className="title" style={{ fontSize: "1.5rem" }}>Attributes</p>
                <div style={{ flex: 1 }}>
                    <table className="nes-table is-bordered is-dark" style={{ width: "100%" }}>
                        <tbody>
                        <tr>
                            <td style={{ width: "35%" }}><i className="ra ra-health"></i> NAME</td>
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
                <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                    <button
                        onClick={() => navigate('edit')}
                        type="button"
                        className="nes-btn is-warning"
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                    >
                        <i className="ra ra-cog"></i> EDIT INFO
                    </button>
                    <button
                        onClick={() => navigate('history')}
                        type="button"
                        className="nes-btn is-success"
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                    >
                        <i className="ra ra-book"></i> HISTORY
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ProfileView;