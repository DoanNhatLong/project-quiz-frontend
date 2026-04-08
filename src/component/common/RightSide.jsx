import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/userSlice.js";
import './css/RightSide.css';

const getRankInfo = (xp = 0) => {
    if (xp <= 100) return { level: 1, title: "Newbie", icon: "nes-ash", color: "#f7d51d" };
    if (xp <= 300) return { level: 2, title: "Adventurer", icon: "nes-squirtle", color: "#2ecc71" };
    if (xp <= 600) return { level: 3, title: "Warrior", icon: "nes-bulbasaur", color: "#3498db" };
    if (xp <= 1000) return { level: 4, title: "Elite", icon: "nes-charmander", color: "#e67e22" };
    return { level: 5, title: "Grandmaster", icon: "nes-mario", color: "#9b59b6" };
};

const RightSide = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.data);
    const rank = getRankInfo(user?.xp);


    function handleLogout() {
        dispatch(logout());
        navigate('/login');
    }

    const isTeacher = user?.roles?.includes("teacher") || user?.roles?.includes("admin");

    return (
        <aside className="side-wrapper">
            <div className="nes-container is-dark is-rounded custom-container">
                <div className="content-flex">
                    {user ? (
                        <>
                            <div style={{ textAlign: "center" }}>
                                <i className={rank.icon} style={{ transform: "scaleX(-1)" }}></i>
                                <p style={{ marginTop: "10px", color: rank.color, fontWeight: "bold" }}>
                                    LVL. {rank.level} {rank.title}
                                </p>
                                <h3 style={{ fontSize: "1.1rem" }}>{user.username}</h3>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "5px" }}>
                                    <i className="ra ra-emerald ra-lg" style={{ color: "#2ecc71" }}></i>
                                    <span style={{ fontSize: "1rem", color: "#2ecc71", fontWeight: "bold" }}>
                                        {user.point || 0}
                                    </span>
                                </div>
                            </div>

                            <div className="btn-stack">
                                <button type="button" className="nes-btn is-primary is-fullwidth" onClick={() => navigate('/profile')} style={{ fontSize: "0.8rem" }}>
                                    HỒ SƠ CÁ NHÂN
                                </button>
                                <button type="button" className="nes-btn is-warning is-fullwidth" onClick={() => navigate('/review')} style={{ fontSize: "0.8rem" }}>
                                    XEM LẠI BÀI THI
                                </button>
                                {isTeacher && (
                                    <button
                                        type="button"
                                        className="nes-btn is-success is-fullwidth"
                                        onClick={() => navigate('/teacher/exam')}
                                        style={{ fontSize: "0.8rem" }}
                                    >
                                        QUẢN LÝ ĐỀ THI
                                    </button>
                                )}
                                <button type="button" className="nes-btn is-error is-fullwidth" onClick={handleLogout} style={{ fontSize: "0.8rem" }}>
                                    ĐĂNG XUẤT
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ textAlign: "center" }}>
                                <i className="nes-pokeball"></i>
                                <h3 style={{ marginTop: "10px" }}>Hello, Guest</h3>
                                <p style={{ fontSize: "0.8rem" }}>Đăng nhập để có thể xem lại quiz</p>
                            </div>
                            <div className="btn-stack">
                                <button type="button" className="nes-btn is-success is-fullwidth" onClick={() => navigate('/login')} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                    <i className="ra ra-key"></i> Đăng nhập
                                </button>
                                <button type="button" className="nes-btn is-warning is-fullwidth" onClick={() => navigate('/register')}>
                                    Đăng kí
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default RightSide;