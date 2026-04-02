import React from "react";

export default function ConfirmModal({ open, message, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <p style={{ marginBottom: "20px" }}>{message}</p>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button onClick={onCancel} style={btnCancel}>
                        Hủy
                    </button>
                    <button onClick={onConfirm} style={btnConfirm}>
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
};

const modalStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "300px",
};

const btnCancel = {
    padding: "6px 12px",
};

const btnConfirm = {
    padding: "6px 12px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
};