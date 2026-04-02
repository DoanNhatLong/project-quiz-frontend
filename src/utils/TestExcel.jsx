import React, { useState } from 'react';
import { HandleImport } from "./HandleImport.jsx";

const TestExcel = () => {
    const [result, setResult] = useState([]);

    const onFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Chạy hàm HandleImport (truyền quizId = 1 để test)
            const data = await HandleImport(file, 1);

            console.log("--- DỮ LIỆU JSON ---", data);
            setResult(data); // Lưu vào state để hiển thị ra màn hình luôn

        } catch (err) {
            console.error(err);
            alert("Lỗi đọc file: " + err);
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial' }}>
            <h2 style={{ color: '#2c3e50' }}>🛠 Hệ thống Test Import Excel</h2>

            {/* Khu vực Upload */}
            <div style={{
                border: '2px dashed #3498db',
                padding: '30px',
                borderRadius: '10px',
                backgroundColor: '#f8fbff',
                marginBottom: '20px'
            }}>
                <p>Chọn file Excel của bạn để kiểm tra cấu trúc Object:</p>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={onFileChange}
                    style={{ fontSize: '16px' }}
                />
            </div>

            {/* Hiển thị kết quả trực quan thay vì chỉ nhìn Console */}
            {result.length > 0 && (
                <div>
                    <h3 style={{ color: '#27ae60' }}>✅ Đã đọc được {result.length} câu hỏi:</h3>
                    <div style={{
                        backgroundColor: '#2d3436',
                        color: '#fab1a0',
                        padding: '15px',
                        borderRadius: '5px',
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestExcel;