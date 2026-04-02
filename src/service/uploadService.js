import axios from "axios";

const CLOUD_NAME = "dhtnb50jt"; // Thay bằng Cloud Name của bạn
const UPLOAD_PRESET = "quiz_14"; // Thay bằng Upload Preset của bạn

export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData
        );
        // Trả về link secure_url nếu thành công
        return response.data.secure_url;
    } catch (error) {
        console.error("Lỗi Upload Cloudinary:", error);
        throw error; // Quăng lỗi để bên UI xử lý (hiển thị toast/alert)
    }
};