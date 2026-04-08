import React, { useRef } from "react";

export default function ReportModal({ isOpen, onClose, onSubmit }) {
    const textAreaRef = useRef(null);

    if (!isOpen) return null;

    const handleInternalSubmit = () => {
        const content = textAreaRef.current.value;
        if (!content.trim()) return;
        onSubmit(content);
    };

    return (
        <>
            {/* Nhúng CSS trực tiếp vào component */}
            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    background: #fff;
                    width: 100%;
                    max-width: 450px;
                    padding: 30px;
                    border-radius: 16px;
                    position: relative;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    animation: modalSlideUp 0.3s ease-out;
                }
                @keyframes modalSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .modal-close-x {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: #f0f0f0;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    font-size: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    color: #555;
                }
                .modal-close-x:hover {
                    background: #ff4d4f;
                    color: white;
                    transform: rotate(90deg);
                }
                .modal-content h3 {
                    margin: 0 0 20px 0;
                    font-size: 1.4rem;
                    color: #1a1a1a;
                    font-weight: 700;
                }
                .modal-content textarea {
                    width: 100%;
                    padding: 15px;
                    border: 2px solid #eee;
                    border-radius: 12px;
                    resize: none;
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.3s;
                    box-sizing: border-box;
                    margin-bottom: 20px;
                }
                .modal-content textarea:focus {
                    border-color: #007bff;
                }
                .btn-submit {
                    width: 100%;
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .btn-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,123,255,0.4);
                }
                .btn-submit:active {
                    transform: translateY(0);
                }
            `}</style>

            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                    {/* Nút X tròn hiện đại */}
                    <button className="modal-close-x" onClick={onClose}>
                        &times;
                    </button>

                    <h3>Gửi báo cáo lỗi</h3>

                    <textarea
                        ref={textAreaRef}
                        placeholder="Nội dung câu hỏi bị sai, đáp án không chính xác..."
                        rows={5}
                    />

                    <button
                        onClick={handleInternalSubmit}
                        className="btn-submit"
                    >
                        Xác nhận gửi
                    </button>
                </div>
            </div>
        </>
    );
}