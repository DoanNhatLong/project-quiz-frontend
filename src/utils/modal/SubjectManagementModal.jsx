import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';

import { toast } from 'react-toastify';
import {createSubject, getAllSubjects} from "../../service/adminService.js";

const SubjectManagementModal = ({ isOpen, onClose }) => {
    const [newSubjectName, setNewSubjectName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: subjects, loading, error, refresh } = useApi(getAllSubjects, [], isOpen);

    if (!isOpen) return null;

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!newSubjectName.trim()) {
            toast.warn("Vui lòng nhập tên chủ đề!");
            return;
        }

        setIsSubmitting(true);
        try {
            await createSubject({ name: newSubjectName });
            toast.success("Thêm chủ đề thành công!");
            setNewSubjectName("");
            refresh();
        } catch (err) {
            toast.error("Lỗi khi thêm chủ đề!");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '500px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                    <h3>Quản lý Chủ đề (Subjects)</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                </div>

                <form onSubmit={handleAddSubject} style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Nhập tên chủ đề mới..."
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        className="form-control"
                        style={{ flex: 1, padding: '8px' }}
                    />
                    <button
                        type="submit"
                        className="btn-admin"
                        style={{ backgroundColor: '#27ae60', color: 'white' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang lưu..." : "Thêm"}
                    </button>
                </form>

                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <label style={{ fontWeight: 'bold' }}>Danh sách hiện có:</label>
                    {loading && <p>Đang tải danh sách...</p>}
                    {error && <p style={{ color: 'red' }}>Lỗi tải dữ liệu!</p>}

                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                        {subjects && subjects.map((sub, index) => (
                            <li key={sub.id || index} style={{
                                padding: '10px',
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <span>{index + 1}. {sub.name}</span>
                            </li>
                        ))}
                        {subjects?.length === 0 && <p>Chưa có chủ đề nào.</p>}
                    </ul>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button className="btn-admin" onClick={onClose} style={{ backgroundColor: '#95a5a6', color: 'white' }}>
                        Đóng
                    </button>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex; justify-content: center; align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .form-control {
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default SubjectManagementModal;