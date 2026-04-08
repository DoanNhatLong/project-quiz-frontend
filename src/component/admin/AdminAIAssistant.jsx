import React, {useMemo, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {buildTeacherPrompt, buildTeacherPromptAcademic} from "../../utils/aiPromptHelper.jsx";
import api from "../../api/axios.js";
import {useApi} from "../../hooks/useApi.jsx";
import {getSubject} from "../../service/adminService.js";

export default function AdminAIAssistant() {
    const {quizId} = useParams();
    const navigate = useNavigate();
    const getSubjectApi = useMemo(() => () => getSubject(quizId), [quizId]);
    const {data: subjectId} = useApi(getSubjectApi, [quizId]);
    console.log(subjectId);

    // State cho việc tạo câu hỏi
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState(3);
    const [loading, setLoading] = useState(false);

    // State quản lý danh sách câu hỏi AI trả về
    const [aiQuestions, setAiQuestions] = useState([]);
    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    // 1. Hàm gọi AI soạn bài
    const handleGenerateAI = async () => {
        if (!topic.trim()) return toast.warning("Nhập chủ đề tạo câu hỏi");

        setLoading(true);
        let prompt="";
        if ([1, 2].includes(Number(subjectId))) {
            prompt = buildTeacherPrompt(topic, difficulty, 20);
        } else {
            prompt = buildTeacherPromptAcademic(topic, difficulty, 20);
        }

        try {
            const response = await api.post("/api/ai/generate-quiz", {
                model: "llama-3.3-70b-versatile",
                messages: [{role: "user", content: prompt}],
                temperature: 0.7,
                response_format: {type: "json_object"}
            });

            const aiContent = response.data.choices[0].message.content;

            const cleanAndParse = (str) => {
                try {
                    const start = str.indexOf('[');
                    const end = str.lastIndexOf(']');
                    if (start !== -1 && end !== -1) {
                        const jsonString = str.substring(start, end + 1);
                        return JSON.parse(jsonString);
                    }
                    return JSON.parse(str);
                } catch (e) {
                    console.error("Lỗi parse JSON:", e);
                    return null;
                }
            };

            const finalData = cleanAndParse(aiContent);

            if (finalData && Array.isArray(finalData)) {
                setAiQuestions(finalData);
                setSelectedIndexes([]);
                toast.success("AI đã soạn xong 20 câu hỏi siêu tốc!");
            } else {
                toast.error("Định dạng dữ liệu AI trả về không đúng.");
            }

        } catch (error) {
            console.error("Lỗi Groq:", error.response?.data || error.message);
            toast.error("Lỗi khi gọi API. Kiểm tra console!");
        } finally {
            setLoading(false);
        }
    };

    // 2. Hàm chọn/bỏ chọn câu hỏi
    const toggleSelect = (index) => {
        setSelectedIndexes(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIndexes.length === aiQuestions.length) {
            setSelectedIndexes([]);
        } else {
            const allIndexes = aiQuestions.map((_, index) => index);
            setSelectedIndexes(allIndexes);
        }
    };

    // 3. Hàm gửi dữ liệu về Backend (Khớp QuestionUploadDto)
    const handleAddSelectedToQuiz = async () => {
        if (selectedIndexes.length === 0) return toast.error("Vui lòng chọn ít nhất 1 câu để thêm!");

        const payload = selectedIndexes.map(index => {
            const q = aiQuestions[index];
            const correctCount = q.answers.filter(a => a.is_correct).length;

            return {
                quiz_id: parseInt(quizId),
                content: q.content,
                type: correctCount > 1 ? 'multiple' : 'single',
                answers: q.answers.map(ans => ({
                    content: ans.content,
                    is_correct: ans.is_correct
                }))
            };
        });

        try {
            const res = await api.post(`${import.meta.env.VITE_API_BASE_URL}/questions/upload-list`, payload);
            if (res.status === 200 || res.status === 201) {
                toast.success(`Đã thêm thành công ${payload.length} câu hỏi vào kho!`);
                navigate(`/admin/quiz`);
            }
        } catch (error) {
            toast.error("Lỗi khi lưu câu hỏi vào hệ thống!");
            console.log(error);
        }
    };
    const handleEditChange = (qIndex, field, value, aIndex = null) => {
        const newQuestions = [...aiQuestions];
        if (aIndex === null) {
            // Edit nội dung câu hỏi
            newQuestions[qIndex][field] = value;
        } else {
            // Edit nội dung đáp án hoặc check đúng/sai
            newQuestions[qIndex].answers[aIndex][field] = value;
        }
        setAiQuestions(newQuestions);
    };

    return (
        <div className="admin-table-container" style={{maxWidth: '1100px', margin: '0 auto', padding: '20px'}}>
            {/* Header */}
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                <button className="btn-admin" style={{backgroundColor: '#6c757d', color: 'white'}}
                        onClick={() => navigate(-1)}>
                    ⬅ Quay lại
                </button>
                <h3>Trợ lý Soạn thảo AI (Giảng viên Mode)</h3>
            </div>

            {/* Input Area */}
            <div className="admin-card" style={{
                padding: '25px',
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #ddd',
                marginBottom: '30px'
            }}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 200px 200px', gap: '15px', alignItems: 'end'}}>
                    <div>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>Chủ đề câu
                            hỏi:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ví dụ: React Hooks, Spring Security, SQL Optimization..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc'}}
                        />
                    </div>
                    <div>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>Độ
                            khó: {difficulty}/5</label>
                        <input
                            type="range" min="1" max="5"
                            value={difficulty}
                            onChange={(e) => setDifficulty(parseInt(e.target.value))}
                            style={{width: '100%', cursor: 'pointer'}}
                        />
                    </div>
                    <button
                        className="btn-admin"
                        style={{backgroundColor: '#8e44ad', color: 'white', height: '42px', fontWeight: 'bold'}}
                        onClick={handleGenerateAI}
                        disabled={loading}
                    >
                        {loading ? "⌛ Đang soạn 20 câu..." : "✨ AI Soạn Câu Hỏi"}
                    </button>
                </div>
            </div>

            {/* Questions Table */}
            {aiQuestions.length > 0 && (
                <div className="admin-card"
                     style={{background: '#fff', borderRadius: '12px', border: '1px solid #ddd', overflow: 'hidden'}}>
                    <div style={{
                        padding: '15px',
                        background: '#f8f9fa',
                        borderBottom: '1px solid #ddd',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span
                            style={{fontWeight: 'bold'}}>📋 Kết quả từ AI ({selectedIndexes.length}/{aiQuestions.length} câu được chọn)
                        </span>
                        <button
                            className="btn-admin"
                            style={{
                                backgroundColor: selectedIndexes.length === aiQuestions.length ? '#e67e22' : '#34495e',
                                color: 'white',
                                padding: '5px 15px',
                                fontSize: '0.85rem'
                            }}
                            onClick={toggleSelectAll}
                        >
                            {selectedIndexes.length === aiQuestions.length ? "🔲 Bỏ chọn tất cả" : "✅ Chọn tất cả"}
                        </button>
                        <button
                            className="btn-admin"
                            style={{backgroundColor: '#27ae60', color: 'white'}}
                            onClick={handleAddSelectedToQuiz}
                        >
                            ➕ Thêm vào bộ câu hỏi
                        </button>
                    </div>
                    <div style={{maxHeight: '600px', overflowY: 'auto'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead style={{position: 'sticky', top: 0, background: '#eee', zIndex: 1}}>
                            <tr>
                                <th style={{padding: '12px', width: '50px'}}>Chọn</th>
                                <th style={{padding: '12px', textAlign: 'left'}}>Nội dung câu hỏi</th>
                                <th style={{padding: '12px', textAlign: 'left', width: '300px'}}>Đáp án đúng</th>
                            </tr>
                            </thead>
                            <tbody>
                            {aiQuestions.map((q, index) => (
                                <tr key={index} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={{textAlign: 'center'}}>
                                        <input type="checkbox" checked={selectedIndexes.includes(index)}
                                               onChange={() => toggleSelect(index)}/>
                                    </td>
                                    <td style={{padding: '12px'}}>
                                        {editingIndex === index ? (
                                            /* GIAO DIỆN KHI ĐANG EDIT */
                                            <div>
                                <textarea
                                    value={q.content}
                                    onChange={(e) => handleEditChange(index, 'content', e.target.value)}
                                    style={{width: '100%', marginBottom: '10px'}}
                                />
                                                {q.answers.map((ans, i) => (
                                                    <div key={i}
                                                         style={{display: 'flex', gap: '10px', marginBottom: '5px'}}>
                                                        <input
                                                            type="checkbox"
                                                            checked={ans.is_correct}
                                                            onChange={(e) => handleEditChange(index, 'is_correct', e.target.checked, i)}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={ans.content}
                                                            onChange={(e) => handleEditChange(index, 'content', e.target.value, i)}
                                                            style={{flex: 1}}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            /* GIAO DIỆN HIỂN THỊ TĨNH */
                                            <>
                                                <div style={{fontWeight: '500'}}>{q.content}</div>
                                                <div style={{fontSize: '0.85rem', color: '#666', marginTop: '5px'}}>
                                                    {q.answers.map((ans, i) => (
                                                        <div key={i}>• {ans.content} {ans.is_correct &&
                                                            <span style={{color: 'green'}}>(Đúng)</span>}</div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </td>
                                    <td style={{padding: '12px', textAlign: 'center'}}>
                                        {editingIndex === index ? (
                                            <button className="btn-admin" style={{backgroundColor: '#2ecc71'}}
                                                    onClick={() => setEditingIndex(null)}>
                                                💾 Lưu
                                            </button>
                                        ) : (
                                            <button className="btn-admin" style={{backgroundColor: '#3498db'}}
                                                    onClick={() => setEditingIndex(index)}>
                                                ✏️ Sửa
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}