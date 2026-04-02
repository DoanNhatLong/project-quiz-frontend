import ExamProgressSticky from "./ExamProcessSticky.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {getQuestions} from "../../../service/adminService.js";
import "../css/ManagerExam.css"
import MarkDownView from "../../../utils/MarkDownView.jsx";
import {useDispatch, useSelector} from "react-redux";
import {addQuestion} from "../../../redux/examEditorSlice.js";


export default function ManagerExam() {

    const quizId = useParams().quizId;
    const dispatch= useDispatch();
    const [data, setData] = useState({
        content: [],
        totalPages: 0,
        number: 0,
        totalElements: 0
    });
    const targetQuestions = useSelector((state) => state.examEditor.targetQuestions);
    const searchRef = useRef("");
    const selectedQuestions = useSelector((state) => state.examEditor.selectedQuestions);
    const selectedIds = selectedQuestions.map(q => q.id);
    const [checkedList, setCheckedList] = useState([]);

    const fetchQuestions = (page = 0) => {
        const targetPage = Number(page) || 0;
        const currentSearch = searchRef.current?.value || "";


        getQuestions(quizId, targetPage, currentSearch)
            .then(res => {
                setData({
                    ...res,
                    number: Number(res.page.number),
                    totalPages: Number(res.page.totalPages),
                    totalElements: Number(res.page.totalElements)
                });
            })
            .catch(err => console.error("Lỗi API:", err));
    };

    const handleCheckRow = (question) => {
        setCheckedList(prev => {
            const isExisted = prev.find(q => q.id === question.id);
            if (isExisted) {
                return prev.filter(q => q.id !== question.id);
            } else {
                if (selectedQuestions.length + prev.length >= targetQuestions) {
                    return prev;
                }
                return [...prev, question];
            }
        });
    };

    const handlePushToRedux = () => {
        if (checkedList.length === 0) return;
        dispatch(addQuestion(checkedList));
        setCheckedList([]);
    };

    useEffect(() => {
        fetchQuestions();
    }, [quizId]);

    return (
        <div className="manager-exam-container">
            <ExamProgressSticky />

            <div className="manager-exam-action-bar">
                <div>
                    <input ref={searchRef} className="search-input" placeholder="Tìm nội dung câu hỏi..." />
                    <button className="btn-search" onClick={() => fetchQuestions(0)}>Tìm kiếm</button>
                </div>

                <button
                    className="btn-bulk"
                    onClick={handlePushToRedux}
                    disabled={selectedQuestions.length >= targetQuestions || checkedList.length === 0}
                    style={{ backgroundColor: (selectedQuestions.length < targetQuestions && checkedList.length > 0) ? "#28a745" : "#ccc" }}

                >
                    + Thêm vào đề thi {checkedList.length > 0 && `(${checkedList.length})`}
                </button>
            </div>

            <table className="question-table">
                <thead>
                <tr style={{ backgroundColor: "#f4f4f4" }}>
                    <th>Nội dung câu hỏi & Câu trả lời</th>
                    <th style={{ width: "80px", textAlign: "center" }}>Chọn</th>
                </tr>
                </thead>
                <tbody>
                {data.content && data.content.length > 0 ? (
                    data.content.map((q) => {
                        const isAlreadyInRedux = selectedIds.includes(q.id);
                        const isSelected = isAlreadyInRedux || checkedList.some(item => item.id === q.id);

                        return (
                            <tr key={q.id} style={{ opacity: isAlreadyInRedux ? 0.6 : 1 }}>
                                <td>
                                    <div style={{ fontWeight: "600", marginBottom: "10px" }}>
                                        <MarkDownView content={q.content} />
                                        {isAlreadyInRedux && (
                                            <span style={{ color: "green", fontSize: "12px", marginLeft: "10px" }}>
                                                    (Đã có trong tiến trình)
                                                </span>
                                        )}
                                    </div>
                                    <div className="answers-wrapper">
                                        {q.answers?.map(ans => (
                                            <span key={ans.id} className={`answer-tag ${ans.correct ? 'correct' : ''}`}>
                                                    {ans.content} {ans.correct && "✓"}
                                                </span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="checkbox"
                                        className="custom-checkbox"
                                        disabled={isAlreadyInRedux}
                                        checked={isSelected}
                                        onChange={() => handleCheckRow(q)}
                                    />
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr><td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>Không có dữ liệu</td></tr>
                )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
                <button disabled={data.number <= 0} onClick={() => fetchQuestions(data.number - 1)}>Trước</button>
                <span style={{ alignSelf: "center", fontWeight: "bold" }}>
                    Trang {data.number + 1} / {data.totalPages}
                </span>
                <button disabled={data.number >= data.totalPages - 1} onClick={() => fetchQuestions(data.number + 1)}>Sau</button>
            </div>
        </div>
    );
}

