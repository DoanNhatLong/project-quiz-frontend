import {useCallback, useState} from "react";
import "./css/AdminLog.css";
import { getAllAdminLogs } from "../../service/adminService.js";
import Swal from "sweetalert2";
import api from "../../api/axios.js";
import { toast } from "react-toastify";
import {useApi} from "../../hooks/useApi.jsx";

const ACTION_MAP = {
    "edit_question": "Sửa câu hỏi",
    "delete_question": "Xóa câu hỏi",
    "create_exam": "Tạo đề thi",
    "auth_login": "Tài khoản",
    "": "Tất cả"
};

export default function AdminLog() {
    const [activeTab, setActiveTab] = useState("");

    const fetchLogs = useCallback(() => {
        return getAllAdminLogs(activeTab);
    }, [activeTab]);

    const { data: logs, loading, refresh } = useApi(fetchLogs, [activeTab]);

    const onDelete = (id) => {
        Swal.fire({
            title: "Xác nhận xóa?",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy"
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/admin/details/log/${id}`)
                    .then(() => {
                        toast.success("Đã xóa thành công");
                        refresh();
                    })
                    .catch(err => console.error(err));
            }
        });
    };

    return (
        <div className="admin-log-container">
            <div className="tab-list">
                {Object.keys(ACTION_MAP).map((type) => (
                    <button
                        key={type}
                        className={`tab-item ${activeTab === type ? "active" : "inactive"}`}
                        onClick={() => setActiveTab(type)}
                    >
                        {ACTION_MAP[type]}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {loading ? (
                    <p style={{ textAlign: "center" }}>Đang tải...</p>
                ) : (
                    <table className="log-table">
                        <thead>
                        <tr>
                            <th>Thời gian</th>
                            <th>Người thực hiện</th>
                            <th>Hành động</th>
                            <th>Chi tiết thao tác</th>
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(logs || [])
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((log) => {
                                let detailObj = {};
                                try {
                                    detailObj = JSON.parse(log.actionDetail);
                                    // eslint-disable-next-line no-unused-vars
                                } catch (e) {
                                    detailObj = {};
                                }

                                const params = detailObj.params?.[0];
                                const displayInfo = typeof params === 'object'
                                    ? (params.title || params.content || "N/A")
                                    : (params || "N/A");

                                return (
                                    <tr key={log.id}>
                                        <td>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                                        <td><strong>{log.adminUsername}</strong></td>
                                        <td>
                                                <span className={`badge-log ${log.actionType}`}>
                                                    {ACTION_MAP[log.actionType]}
                                                </span>
                                        </td>
                                        <td className="detail-cell">{displayInfo}</td>
                                        <td>
                                            <button
                                                className="btn-delete-log"
                                                onClick={() => onDelete(log.id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                {!loading && logs?.length === 0 && (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>Không có dữ liệu.</p>
                )}
            </div>
        </div>
    );
}