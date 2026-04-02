import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ExamConfigModal from "../../utils/modal/ExamConfigModal.jsx";
import {useDispatch, useSelector} from "react-redux";
import {resetEditor, updateExamInfo} from "../../redux/examEditorSlice.js";
import ResumeDraftModal from "../../utils/modal/ResumeDraftModal.jsx";
import {BackButton} from "../../utils/Back.jsx";
import {useApi} from "../../hooks/useApi.jsx";
import {getAllSubjects} from "../../service/adminService.js";

const AdminExam = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentDraft = useSelector((state) => state.examEditor);
    const { data: subjects, loading: loadingSubjects } = useApi(getAllSubjects);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
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


    const buttonStyle = {
        padding: '20px 40px',
        margin: '10px',
        fontSize: '18px',
        cursor: 'pointer',
        borderRadius: '8px',
        border: '1px solid #ccc',
        backgroundColor: '#f0f0f0'
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center' ,
                flexDirection: 'column',
                gap: '20px'
            }}>
                <BackButton navigate={navigate} path="/admin"/>
                {loadingSubjects ? (
                    <p>Đang tải danh sách môn học...</p>
                ) : (
                    subjects?.map((sub) => (
                        <button
                            key={sub.id}
                            style={buttonStyle}
                            onClick={() => handleButtonClick(sub.name)}
                        >
                            Tạo đề {sub.name}
                        </button>
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