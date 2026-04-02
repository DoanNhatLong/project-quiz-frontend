import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { userService } from "../../service/userService.js";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import HCaptcha from '@hcaptcha/react-hcaptcha'; // Import hCaptcha
import "./css/Register.css";

const Register = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const captchaRef = useRef(null); // Ref để điều khiển hCaptcha (reset khi cần)

    // Site Key thử nghiệm (luôn chạy trên localhost), thay bằng Key thật của bạn khi xong
    const SITE_KEY = "46e49518-c828-44f0-8dc4-9aecc8dce718";

    useEffect(() => {
        userService.getAllUsers().then(data => setUsers(data));
    }, []);

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            captchaToken: '', // Lưu token xác thực từ hCaptcha
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Bắt buộc nhập username')
                .test('checkUnique', 'Username đã tồn tại',
                    value => !userService.checkDuplicate('username', value, users)),
            email: Yup.string()
                .email('Email không hợp lệ')
                .required('Bắt buộc nhập email')
                .test('checkUnique', 'Email đã tồn tại',
                    value => !userService.checkDuplicate('email', value, users)),
            password: Yup.string()
                .min(3, 'Tối thiểu 3 ký tự')
                .required('Bắt buộc nhập mật khẩu'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
                .required('Bắt buộc nhập lại mật khẩu'),
            // Bắt buộc phải giải Captcha mới cho Submit
            captchaToken: Yup.string().required('Vui lòng xác minh bạn không phải robot'),
        }),
        onSubmit: (values) => {
            // Loại bỏ các trường không cần gửi lên Server (confirmPassword, captchaToken)
            const { confirmPassword, captchaToken, ...dataSubmit } = values;

            userService.registerUser(dataSubmit)
                .then(() => {
                    toast.success("Đăng ký thành công!");
                    formik.resetForm();
                    navigate('/login');
                })
                .catch(() => {
                    toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
                    // Đăng ký lỗi thì bắt làm lại Captcha mới cho "khó chịu"
                    captchaRef.current.resetCaptcha();
                    formik.setFieldValue("captchaToken", "");
                });
        },
    });

    // Hàm xử lý khi người dùng giải xong Captcha
    const handleVerificationSuccess = (token) => {
        formik.setFieldValue("captchaToken", token);
    };

    return (
        <div className="register-container">
            <form onSubmit={formik.handleSubmit} className="register-form">
                <h2>Đăng ký tài khoản</h2>

                <div className="form-group">
                    <input {...formik.getFieldProps('username')} placeholder="Username" />
                    {formik.touched.username && formik.errors.username && <small className="error-message">{formik.errors.username}</small>}
                </div>

                <div className="form-group">
                    <input {...formik.getFieldProps('email')} placeholder="Email" />
                    {formik.touched.email && formik.errors.email && <small className="error-message">{formik.errors.email}</small>}
                </div>

                <div className="form-group">
                    <input type="password" {...formik.getFieldProps('password')} placeholder="Mật khẩu" />
                    {formik.touched.password && formik.errors.password && <small className="error-message">{formik.errors.password}</small>}
                </div>

                <div className="form-group">
                    <input type="password" {...formik.getFieldProps('confirmPassword')} placeholder="Xác nhận mật khẩu" />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && <small className="error-message">{formik.errors.confirmPassword}</small>}
                </div>

                {/* KHU VỰC HCAPCHA */}
                <div className="form-group captcha-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
                    <HCaptcha
                        sitekey={SITE_KEY}
                        onVerify={handleVerificationSuccess}
                        ref={captchaRef}
                        onExpire={() => formik.setFieldValue("captchaToken", "")} // Hết hạn thì xóa token
                    />
                    {formik.touched.captchaToken && formik.errors.captchaToken && (
                        <small className="error-message">{formik.errors.captchaToken}</small>
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