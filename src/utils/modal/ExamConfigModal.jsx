import React, { useState } from 'react';

const ExamConfigModal = ({ isOpen, type, onClose, onConfirm }) => {
    const [config, setConfig] = useState({
        title: '',
        description: '',
        targetQuestions: 20,
        duration: 30,
        passScore: 70
    });

    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (error) setError('');

        setConfig(prev => ({
            ...prev,
            [name]: ['targetQuestions', 'duration', 'passScore'].includes(name)
                ? (value === '' ? '' : Number(value))
                : value
        }));
    };

    const handleConfirm = () => {
        const { title, targetQuestions, duration, passScore } = config;

        if (!title.trim()) {
            setError('Vui lòng nhập tiêu đề đề thi!');
            return;
        }

        if (!Number.isInteger(targetQuestions) || targetQuestions < 20) {
            setError('Số câu hỏi phải là số nguyên và ít nhất 20 câu!');
            return;
        }

        if (!Number.isInteger(duration) || duration < 5) {
            setError('Thời gian làm bài phải ít nhất 15 phút!');
            return;
        }

        if (passScore < 60 || passScore > 100) {
            setError('Điểm đạt phải nằm trong khoảng từ 60% đến 100%!');
            return;
        }

        setError('');
        onConfirm(config);
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000,
            backdropFilter: 'blur(3px)'
        }}>
            <div style={{
                backgroundColor: 'white', padding: '30px', borderRadius: '12px',
                width: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                    Thiết lập đề {type}
                </h2>

                {error && (
                    <div style={{
                        backgroundColor: '#fff2f0', border: '1px solid #ffccc7',
                        color: '#ff4d4f', padding: '10px', borderRadius: '8px',
                        marginBottom: '15px', fontSize: '14px', fontWeight: '500'
                    }}>
                        ❌ {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tiêu đề:</label>
                        <input
                            name="title" type="text"
                            style={inputStyle}
                            value={config.title}
                            onChange={handleChange}
                            placeholder="Nhập tên kỳ thi..."
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mô tả:</label>
                        <textarea
                            name="description"
                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            value={config.description}
                            onChange={handleChange}
                            placeholder="Nhập mô tả ngắn về đề thi..."
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Số câu (min 20):</label>
                            <input
                                name="targetQuestions" type="number"
                                style={inputStyle}
                                value={config.targetQuestions}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phút (min 15):</label>
                            <input
                                name="duration" type="number"
                                style={inputStyle}
                                value={config.duration}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Điểm đạt (60 - 100%):</label>
                        <input
                            name="passScore" type="number"
                            style={{
                                ...inputStyle,
                                border: (config.passScore > 100 || (config.passScore < 60 && config.passScore !== '')) ? '2px solid #ff4d4f' : '1px solid #ccc'
                            }}
                            value={config.passScore}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                        <button
                            onClick={handleConfirm}
                            style={{
                                flex: 2, padding: '12px', backgroundColor: '#28a745',
                                color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            Bắt đầu tạo đề
                        </button>
                        <button
                            onClick={() => { setError(''); onClose(); }}
                            style={{
                                flex: 1, padding: '12px', backgroundColor: '#6c757d',
                                color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamConfigModal;