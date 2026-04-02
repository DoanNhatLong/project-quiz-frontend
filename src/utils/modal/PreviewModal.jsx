import React from 'react';

const PreviewModal = ({ isOpen, data, onCancel, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
            <div style={{
                background: 'white', padding: '1.5rem', borderRadius: '0.8rem',
                width: '85%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 0.5rem 1.5rem rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '0.0625rem solid #eee', paddingBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>🔍 Kiểm tra nội dung ({data.length} câu)</h3>
                    <span style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={onCancel}>&times;</span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                    <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                        <th style={{ padding: '0.8rem', border: '0.0625rem solid #ddd', width: '60%' }}>Câu hỏi</th>
                        <th style={{ padding: '0.8rem', border: '0.0625rem solid #ddd' }}>Đáp án</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((q, i) => (
                        <tr key={i}>
                            <td style={{ padding: '0.8rem', border: '0.0625rem solid #ddd', verticalAlign: 'top' }}>
                                <strong>{i + 1}.</strong> {q.content}
                            </td>
                            <td style={{ padding: '0.8rem', border: '0.0625rem solid #ddd' }}>
                                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                    {q.answers.map((ans, idx) => (
                                        <li key={idx} style={{ color: ans.is_correct ? '#27ae60' : '#333', fontWeight: ans.is_correct ? 'bold' : 'normal' }}>
                                            {ans.content} {ans.is_correct && "✔️"}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onCancel} style={{ padding: '0.6rem 1.2rem', borderRadius: '0.4rem', border: '0.0625rem solid #ccc', cursor: 'pointer', background: '#fff' }}>
                        Hủy bỏ
                    </button>
                    <button onClick={onConfirm} style={{ padding: '0.6rem 1.2rem', borderRadius: '0.4rem', backgroundColor: '#27ae60', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        Xác nhận thêm vào
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;