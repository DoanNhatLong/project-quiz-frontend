import { useState } from "react";

function ConfirmModal({ message, onConfirm }) {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleConfirm = () => {
        onConfirm();
        handleClose();
    };

    return (
        <>
            <button
                type="button"
                className="btn-admin btn-delete"
                onClick={handleShow}
            >
                Xóa
            </button>

            {show && (
                <>
                    {/* Lớp phủ mờ toàn màn hình */}
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 9998
                    }} onClick={handleClose}></div>

                    {/* Dialog hiện ở phía trên (Top-Center) */}
                    <div style={{
                        position: 'fixed',
                        top: '50px', // Khoảng cách từ trên xuống
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        animation: 'slideDown 0.3s ease-out' // Hiệu ứng trượt xuống nhẹ
                    }}>
                        <section className="nes-container is-rounded is-white" style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            minWidth: '400px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            border: '4px solid black'
                        }}>
                            <p className="title" style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#d63031', fontWeight: 'bold' }}>
                                ⚠️ Xác nhận thao tác
                            </p>
                            <p style={{ color: '#2d3436', marginBottom: '20px', fontSize: '0.95rem' }}>{message}</p>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    type="button"
                                    className="nes-btn is-small"
                                    onClick={handleClose}
                                    style={{ padding: '5px 15px' }}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="nes-btn is-error is-small"
                                    onClick={handleConfirm}
                                    style={{ padding: '5px 15px' }}
                                >
                                    Xóa ngay
                                </button>
                            </div>
                        </section>
                    </div>

                    <style>
                        {`
                            @keyframes slideDown {
                                from { transform: translate(-50%, -20px); opacity: 0; }
                                to { transform: translate(-50%, 0); opacity: 1; }
                            }
                        `}
                    </style>
                </>
            )}
        </>
    );
}

export default ConfirmModal;