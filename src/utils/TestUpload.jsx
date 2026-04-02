import React, { useState } from 'react';
import {uploadToCloudinary} from "../service/uploadService.js";


export default function TestUpload() {
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            console.log("Đang bắt đầu upload...");
            const url = await uploadToCloudinary(file);
            console.log("Kết quả URL:", url);
            setLink(url);
        } catch (err) {
            console.error("Upload thất bại:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Test Cloudinary Upload</h1>
            <input type="file" onChange={handleFileChange} />

            {loading && <p>Đang tải lên... vui lòng đợi...</p>}

            {link && (
                <div style={{ marginTop: '20px' }}>
                    <p>Thành công! Link ảnh của bạn đây:</p>
                    <a href={link} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>
                        {link}
                    </a>
                    <div style={{ marginTop: '20px' }}>
                        <img src={link} alt="Result" style={{ width: '300px', border: '1px solid #ccc' }} />
                    </div>
                </div>
            )}
        </div>
    );
}