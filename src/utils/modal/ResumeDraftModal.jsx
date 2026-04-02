import React from 'react';

const ResumeDraftModal = ({ isOpen, draftTitle, onResume, onDiscard }) => {
    if (!isOpen) return null;

    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000
    };

    const modalStyle = {
        backgroundColor: 'white', padding: '30px', borderRadius: '12px',
        maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>Phát hiện bản nháp!</h3>
                <p style={{ marginBottom: '25px', color: '#666', lineHeight: '1.5' }}>
                    Bạn đang tạo dở đề thi: <br/>
                    <strong>"{draftTitle || 'Không tên'}"</strong>. <br/>
                    Bạn muốn tiếp tục hay xóa để tạo mới?
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        onClick={onDiscard}
                        style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #dc3545', color: '#dc3545', cursor: 'pointer', backgroundColor: 'white' }}
                    >
                        Xóa bản nháp
                    </button>
                    <button
                        onClick={onResume}
                        style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer' }}
                    >
                        Tiếp tục tạo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeDraftModal;