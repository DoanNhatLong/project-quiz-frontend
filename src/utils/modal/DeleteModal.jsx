import React from "react";

const ConfirmModal = ({ open, message, onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3 style={{ marginTop: 0, color: "#333" }}>Xác nhận hành động</h3>
                <p style={{ margin: "20px 0", color: "#666", lineHeight: "1.5" }}>
                    {message}
                </p>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button onClick={onCancel} style={btnBase}>
                        Hủy
                    </button>
                    <button onClick={onConfirm} style={{ ...btnBase, ...btnConfirm }}>
                        Đồng ý xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

// Styles
const overlayStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const modalStyle = {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    animation: "fadeIn 0.3s ease",
};

const btnBase = {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
};

const btnConfirm = {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
};

export default ConfirmModal;