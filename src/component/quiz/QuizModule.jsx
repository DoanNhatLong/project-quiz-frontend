import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar.jsx";

const modules = [
    { id: 1, name: "Javascript Cơ Bản", icon: "ra-crystal-ball", color: "is-primary" },
    { id: 2, name: "React Hooks", icon: "ra-player-pyromaniac", color: "is-success" },
    { id: 3, name: "Node.js API", icon: "ra-eye-shield", color: "is-warning" },
    { id: 4, name: "Database Design", icon: "ra-gear-hammer", color: "is-error" },
];

export default function QuizModule() {
    const navigate = useNavigate();

    return (
        <div style={{ backgroundColor: "#212529", minHeight: "100vh", color: "white" }}>
            <Navbar />

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
                <section className="nes-container with-title is-centered is-dark" style={{ marginBottom: "40px" }}>
                    <p className="title">SELECT YOUR MISSION</p>
                    <p>Hãy chọn một học phần để bắt đầu thử thách!</p>
                </section>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "25px",
                    justifyContent: "center"
                }}>
                    {modules.map((mod) => (
                        <div key={mod.id} style={{ display: "flex", justifyContent: "center" }}>
                            <button
                                type="button"
                                className={`nes-btn ${mod.color}`}
                                onClick={() => navigate(`/quiz-play/${mod.id}`)}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "30px",
                                    width: "100%",
                                    height: "220px"
                                }}
                            >
                                <i className={`ra ${mod.icon} ra-3x`} style={{ marginBottom: "20px" }}></i>
                                <span style={{ fontSize: "1rem" }}>{mod.name}</span>
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: "60px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <i className="nes-jp-logo"></i>
                    <p style={{ fontSize: "0.8rem", marginTop: "15px" }}>Prepare your knowledge, adventurer!</p>
                </div>
            </div>
        </div>
    );
}