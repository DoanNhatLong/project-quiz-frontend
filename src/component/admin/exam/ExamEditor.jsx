import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {getQuizzesByCategory} from "../../../service/quizService.js";
import ExamProgressSticky from "./ExamProcessSticky.jsx";

export default function ExamEditor() {
    const { type } = useParams();
    const[data, setData] =useState();
    const navigate = useNavigate();

    const handleSelectQuiz = (quizId) => {
        navigate(`/admin/exams/edit/${quizId}`);
    };

    useEffect(() => {
        getQuizzesByCategory(type)
            .then(res => setData(res))
            .catch(error => console.log(error))
    }, [type]);

    return (
        <div style={{ padding: '20px' }}>
            <ExamProgressSticky />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {data && data.map((quiz) => (
                    <div
                        key={quiz.id}
                        onClick={() => handleSelectQuiz(quiz.id)}
                        style={{
                            padding: '15px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: '#f9f9f9',
                            transition: '0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ececec'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                    >
                        <div style={{ fontWeight: 'bold' }}>{quiz.title}</div>
                        <div style={{ fontSize: '0.9em', color: '#666' }}>
                            Độ khó: {quiz.level}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};