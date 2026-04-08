import { useEffect, useState, useMemo } from "react";
import { handleReport } from "../../service/userService.js";
import "./css/AdminReport.css";
import Swal from "sweetalert2";
import {toast} from "react-toastify";
import api from "../../api/axios.js";

export default function AdminReport() {
    const [pending, setPending] = useState([]);
    const [solved, setSolved] = useState([]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        loadData();
    }, []);

    const loadData = () => {
        handleReport("PENDING").then(res => setPending(res));
        handleReport("SOLVED").then(res => setSolved(res));
    };

    const displayData = useMemo(() => {
        const sortedPending = [...pending].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const sortedSolved = [...solved].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return [...sortedPending, ...sortedSolved];
    }, [pending, solved]);

    const onSolve = (id) => {
        Swal.fire({
            title: "Xác nhận đổi trạng thái?",
            showCancelButton: true,
            confirmButtonText: "OK"
        }).then((result) => {
            if (result.isConfirmed) {
                api.put(`/admin/details/report/${id}`)
                    .then(() => {
                        toast.success("Đã chuyển đổi")
                        loadData();
                    })
                    .catch(err => console.error(err));
            }
        });
    };

    const onDelete = (id) => {
        Swal.fire({
            title: "Xác nhận xóa?",
            showCancelButton: true,
            confirmButtonText: "Xóa"
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/admin/details/report/${id}`)
                    .then(() => {
                        toast.success("Đã xóa thành công")
                        loadData();
                    })
                    .catch(err => console.error(err));
            }
        });
    };

    return (
        <div className="admin-report-container">
            <table className="report-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Thông tin thi</th>
                    <th>Nội dung</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {displayData.map((item) => (
                    <tr key={item.id} style={{ opacity: item.status === 'SOLVED' ? 0.7 : 1 }}>
                        <td>#{item.id}</td>
                        <td>
                            <div>Lượt thi: {item.attemptId}</div>
                            <small>Đề: {item.examId}</small>
                        </td>
                        <td>{item.message}</td>
                        <td>{new Date(item.createdAt).toLocaleString('vi-VN')}</td>
                        <td>
                                <span className={`badge ${item.status.toLowerCase()}`}>
                                    {item.status === 'PENDING' ? 'Chưa xử lý' : 'Đã xử lý'}
                                </span>
                        </td>
                        <td>
                            <div className="btn-group">
                                <button
                                    className={item.status === 'PENDING' ? 'btn-process' : 'btn-undo'}
                                    onClick={() => onSolve(item.id)}
                                    style={item.status === 'SOLVED' ? { backgroundColor: '#6c757d' } : {}}
                                >
                                    {item.status === 'PENDING' ? 'Xử lý' : 'Hoàn tác'}
                                </button>
                                <button className="btn-delete" onClick={() => onDelete(item.id)}>
                                    Xóa
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}