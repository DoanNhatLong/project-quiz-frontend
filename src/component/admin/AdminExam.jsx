import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ExamConfigModal from "../../utils/modal/ExamConfigModal.jsx";
import {useDispatch, useSelector} from "react-redux";
import {resetEditor, updateExamInfo} from "../../redux/examEditorSlice.js";
import ResumeDraftModal from "../../utils/modal/ResumeDraftModal.jsx";
import {useApi} from "../../hooks/useApi.jsx";
import {getAllSubjects} from "../../service/adminService.js";
import './exam/css/AdminExam.css'
const SUBJECT_ICONS = {
    'java': '☕',
    'js': '⚛️',
    'math': '📐',
    'toeic': '📜',
    'chemistry': '⚗️',
    'default': '📝'
};

const AdminExam = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentDraft = useSelector((state) => state.examEditor);
    const { data: subjects, loading: loadingSubjects } = useApi(getAllSubjects);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
    const getIcon = (name) => {
        const lowerName = name.toLowerCase();
        const key = Object.keys(SUBJECT_ICONS).find(k => lowerName.includes(k));
        return SUBJECT_ICONS[key] || SUBJECT_ICONS['default'];
    };
    useEffect(() => {
        const hasQuestions = currentDraft?.selectedQuestions?.length > 0;
        const hasTitle = currentDraft?.title && currentDraft.title.trim() !== '';

        if (hasQuestions || hasTitle) {
            setTimeout(() => {
                setIsResumeModalOpen(true);
            }, 0);
        }
    }, []);
    const [selectedType, setSelectedType] = useState('');

    const handleResume = () => {
        setIsResumeModalOpen(false);
        const targetType = currentDraft.type || 'ALL';
        navigate(`/admin/exams/create/${targetType}`);
    };

    const handleDiscard = () => {
        dispatch(resetEditor());
        setIsResumeModalOpen(false);
    };
    const handleButtonClick = (type) => {
        setSelectedType(type);
        setIsModalOpen(true);
    };

    const handleConfirmConfig = (configData) => {
        dispatch(resetEditor());
        const mapping = {
            type: selectedType,
            title: configData.title,
            description: configData.description,
            durationMinutes: Number(configData.duration),
            passScorePercentage: Number(configData.passScore) / 100,
            targetQuestions: Number(configData.targetQuestions)
        };

        Object.keys(mapping).forEach(field => {
            dispatch(updateExamInfo({ field, value: mapping[field] }));
        });
        setIsModalOpen(false);
        setTimeout(() => {
            navigate(`/admin/exams/create/${selectedType}`);
        }, 0);
    };


    return (
        <div className="admin-exam-container">

            <div className="subject-grid">
                {loadingSubjects ? (
                    <p className="loading-text">Đang tải danh sách môn học...</p>
                ) : (
                    subjects?.map((sub) => (
                        <div key={sub.id} className="subject-card">
                            <div className="card-icon">
                                {getIcon(sub.name)}
                            </div>
                            <div>
                                <h3>{sub.name}</h3>
                                <p>Bắt đầu thiết lập cấu hình và câu hỏi cho đề thi mới.</p>
                            </div>
                            <button
                                className="btn-create"
                                onClick={() => handleButtonClick(sub.name)}
                            >
                                Tạo đề thi ngay
                            </button>
                        </div>
                    ))
                )}
            </div>

            <ResumeDraftModal
                isOpen={isResumeModalOpen}
                draftTitle={currentDraft?.title}
                onResume={handleResume}
                onDiscard={handleDiscard}
            />
            <ExamConfigModal
                isOpen={isModalOpen}
                type={selectedType}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmConfig}
            />
        </div>
    );
};

export default AdminExam;