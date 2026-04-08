import Navbar from "../common/Navbar.jsx";
import {useNavigate, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import { checkResult } from "../../service/adminService.js";
import "./css/TeacherResult.css";
import {BackButton} from "../../utils/Back.jsx";

export default function TeacherResult() {
    const { examId } = useParams();
    const [data, setData] = useState([]);
    const navigate=useNavigate()

    useEffect(() => {
        checkResult(examId)
            .then(res => setData(res))
            .catch(err => console.error("Lỗi khi lấy dữ liệu:", err));
    }, [examId]);

    const sortedData = [...data].sort((a, b) => b.totalScore - a.totalScore);

    return (
        <>
            <Navbar />
            <BackButton navigate={navigate} path="/teacher/check" />
            <div className="result-container">
                <table className="result-table">
                    <thead>
                    <tr>
                        <th>Tên thí sinh</th>
                        <th>Email</th>
                        <th>Điểm số</th>
                        <th>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.username}</td>
                            <td>{item.email}</td>
                            <td className="score-cell">{item.totalScore}</td>
                            <td>
                                    <span className={item.isPassed ? "status-passed" : "status-failed"}>
                                        {item.isPassed ? "ĐẠT" : "KHÔNG ĐẠT"}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {data.length === 0 && (
                    <p style={{textAlign: 'center', marginTop: '20px'}}>Không có dữ liệu kết quả.</p>
                )}
            </div>
        </>
    );
}