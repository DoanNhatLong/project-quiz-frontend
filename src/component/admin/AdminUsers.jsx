import React, { useState, useEffect } from 'react';
import api from "../../api/axios.js";
import './css/AdminUsers.css';
import Swal from "sweetalert2";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async (page, name) => {
        try {
            const response = await api.get(`/users/admin`, {
                params: {
                    username: name,
                    page: page,
                    size: 10
                }
            });
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(currentPage, searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [currentPage, searchTerm]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Xác nhận xóa?",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy"
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/users/${id}`)
                    .then(() => {
                        Swal.fire("Đã xóa!", "Người dùng đã được xóa thành công.", "success");
                        fetchUsers(currentPage, searchTerm);
                    })
                    .catch((error) => {
                        console.error("Lỗi khi xóa:", error);
                        Swal.fire("Lỗi!", "Không thể xóa người dùng này.", "error");
                    });
            }
        });
    };

    return (
        <div className="admin-wrapper">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Tìm theo tên đăng nhập..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(0);
                    }}
                />
            </div>
            <table className="basic-table">
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>XP</th>
                    <th>Vai trò</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={user.id}>
                        <td>{currentPage * 10 + index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td style={{color: 'blue', fontWeight: 'bold'}}>{user.xp}</td>
                        <td style={{color: 'green', fontWeight: 'bold'}}>{user.roles.name}</td>
                        <td>
                            <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                                Block
                            </button>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    className="btn-page"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(p => p - 1)}
                >
                    Trước
                </button>

                <span>Trang {currentPage + 1} / {totalPages}</span>

                <button
                    className="btn-page"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(p => p + 1)}
                >
                    Sau
                </button>
            </div>
        </div>
    );
}