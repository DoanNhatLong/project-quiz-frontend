import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../redux/userSlice.js";

const getRankInfo = (xp = 0) => {
    if (xp <= 100) return {level: 1, title: "Newbie", icon: "nes-ash", color: "#f7d51d"};
    if (xp <= 300) return {level: 2, title: "Adventurer", icon: "nes-squirtle", color: "#2ecc71"};
    if (xp <= 600) return {level: 3, title: "Warrior", icon: "nes-bulbasaur", color: "#3498db"};
    if (xp <= 1000) return {level: 4, title: "Elite", icon: "nes-charmander", color: "#e67e22"};
    return {level: 5, title: "Grandmaster", icon: "nes-mario", color: "#9b59b6"};
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

    return (
        <aside style={{padding: "20px", width: "300px"}}>
            <div className="nes-container is-dark">
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "15px"}}>
                    {user ? (
                        <>
                            <div style={{textAlign: "center"}}>
                                <i className={rank.icon} style={{transform: "scaleX(-1)"}}></i>

                                <p style={{marginTop: "10px", color: rank.color, fontWeight: "bold"}}>
                                    LVL. {rank.level} {rank.title}
                                </p>

                                <h3 style={{fontSize: "1.1rem"}}>{user.username}</h3>

                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    marginTop: "5px"
                                }}>
                                    <i className="ra ra-emerald ra-lg" style={{color: "#2ecc71"}}></i>

                                    <span style={{
                                        fontSize: "1rem",
                                        color: "#2ecc71",
                                        fontWeight: "bold"
                                    }}>{user.point || 0}
                                    </span>
                                </div>
                            </div>

                            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                                <button
                                    type="button"
                                    className="nes-btn is-primary is-fullwidth"
                                    onClick={() => navigate('/profile')}
                                    style={{ fontSize: "0.8rem" }}
                                >
                                    PROFILE
                                </button>

                                <button
                                    type="button"
                                    className="nes-btn is-warning is-fullwidth"
                                    onClick={() => navigate('/review')}
                                    style={{ fontSize: "0.8rem" }}
                                >
                                    REVIEW EXAMS
                                </button>

                                <button
                                    type="button"
                                    className="nes-btn is-error is-fullwidth"
                                    onClick={handleLogout}
                                    style={{ fontSize: "0.8rem" }}
                                >
                                    LOGOUT
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{textAlign: "center"}}>
                                <i className="nes-pokeball"></i>
                                <h3 style={{marginTop: "10px"}}>Hello, Guest</h3>
                                <p style={{fontSize: "0.8rem"}}>Login to save progress</p>
                            </div>

                            <button
                                type="button"
                                className="nes-btn is-success is-fullwidth"
                                onClick={() => navigate('/login')}
                                style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"}}
                            >
                                <i className="ra ra-key"></i>
                                LOGIN
                            </button>

                            <button
                                type="button"
                                className="nes-btn is-warning is-fullwidth"
                                onClick={() => navigate('/register')}
                            >
                                REGISTER
                            </button>
                        </>
                    )}
                </div>
            </div>

        </aside>
    );
};

export default RightSide;