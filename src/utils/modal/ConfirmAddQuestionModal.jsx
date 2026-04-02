import React from 'react';

const ConfirmAddQuestionModal = ({ isOpen, onClose, onConfirm, quizTitle }) => {
    if (!isOpen) return null;

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        },
        content: {
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            width: '400px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            textAlign: 'center'
        },
        title: {
            margin: '0 0 15px 0',
            color: '#2c3e50',
            fontSize: '1.4rem'
        },
        message: {
            marginBottom: '25px',
            color: '#555',
            lineHeight: '1.5'
        },
        quizName: {
            display: 'block',
            fontWeight: 'bold',
            color: '#8e44ad',
            marginTop: '10px',
            fontSize: '1.1rem'
        },
        footer: {
            display: 'flex',
            gap: '12px'
        },
        btnCancel: {
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            fontWeight: 'bold'
        },
        btnConfirm: {
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#8e44ad',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold'
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.content} onClick={e => e.stopPropagation()}>
                <h3 style={styles.title}>Xác nhận</h3>
                <div style={styles.message}>
                    Bạn có muốn thêm câu hỏi vào bộ Quiz:
                    <span style={styles.quizName}>{quizTitle}</span>
                </div>
                <div style={styles.footer}>
                    <button onClick={onClose} style={styles.btnCancel}>
                        Hủy bỏ
                    </button>
                    <button onClick={onConfirm} style={styles.btnConfirm}>
                        Đồng ý
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmAddQuestionModal;