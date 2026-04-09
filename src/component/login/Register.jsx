import React, { useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { userService } from "../../service/userService.js";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import "./css/Register.css";

const Register = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Bắt buộc nhập username')
                .min(2, 'Username phải có ít nhất 2 ký tự')
                .max(30, 'Username không được quá 30 ký tự'),
            email: Yup.string()
                .required('Bắt buộc nhập email')
                .matches(
                    /^[a-z0-9.]+@gmail\.com$/,
                    'Email phải là định dạng @gmail.com (ví dụ: user123@gmail.com)'),
            password: Yup.string()
                .min(3, 'Tối thiểu 3 ký tự')
                .required('Bắt buộc nhập mật khẩu'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
                .required('Bắt buộc nhập lại mật khẩu'),
        }),
        onSubmit: (values, { setSubmitting }) => {
            // Loại bỏ confirmPassword trước khi gửi lên Backend
            const { confirmPassword, ...dataSubmit } = values;

            userService.registerUser(dataSubmit)
                .then(() => {
                    toast.success("Đăng ký thành công!");
                    formik.resetForm();
                    navigate('/login');
                })
                .catch((error) => {
                    // Hiển thị lỗi từ Backend (ví dụ: "Username already exists")
                    const serverError = error.response?.data || "Có lỗi xảy ra! Vui lòng thử lại.";
                    toast.error(serverError);
                })
                .finally(() => {
                    setSubmitting(false);
                });
        },
    });

    return (
        <div className="register-container">
            <form onSubmit={formik.handleSubmit} className="register-form">
                <h2>Đăng ký tài khoản</h2>

                <div className="form-group">
                    <input
                        type="text"
                        {...formik.getFieldProps('username')}
                        placeholder="Username"
                    />
                    {formik.touched.username && formik.errors.username && (
                        <small className="error-message">{formik.errors.username}</small>
                    )}
                </div>

                <div className="form-group">
                    <input
                        type="email"
                        {...formik.getFieldProps('email')}
                        placeholder="Email"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <small className="error-message">{formik.errors.email}</small>
                    )}
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        {...formik.getFieldProps('password')}
                        placeholder="Mật khẩu"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <small className="error-message">{formik.errors.password}</small>
                    )}
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        {...formik.getFieldProps('confirmPassword')}
                        placeholder="Xác nhận mật khẩu"
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <small className="error-message">{formik.errors.confirmPassword}</small>
                    )}
                </div>

                <button type="submit" disabled={formik.isSubmitting} className="btn-submit">
                    {formik.isSubmitting ? 'Đang gửi...' : 'Đăng ký ngay'}
                </button>
            </form>
        </div>
    );
};

export default Register;