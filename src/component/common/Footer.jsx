import React from 'react';

const Footer = () => {
    return (
        <footer className="footer-wrapper" style={{ marginTop: "50px", paddingBottom: "20px" }}>
            <div className="nes-container is-dark with-title">
                <p className="title">Quiz System v1.0</p>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "20px"
                }}>
                    {/* Social Links & Controls */}
                    <div className="social-links">
                        <a href="https://github.com" target="_blank" rel="noreferrer" style={{ marginRight: "15px" }}>
                            <i className="nes-icon github is-medium"></i>
                        </a>
                        <a href="#">
                            <i className="nes-icon twitter is-medium"></i>
                        </a>
                    </div>

                    {/* Credits */}
                    <div style={{ textAlign: "right" }}>
                        <p style={{ marginBottom: "5px" }}>
                            © 2026 <span className="nes-text is-success">Quiz's Project</span>
                        </p>
                        <p style={{ fontSize: "0.8rem", marginBottom: 0 }}>
                            Powered by <span className="nes-text is-error">NES.css</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;