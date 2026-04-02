import LoginForm from "../component/login/LoginForm.jsx";
import LoginGoogle from '../component/login/LoginGoogle'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-8">
            <div style={{
                background: 'white',
                border: '3px solid #111',
                boxShadow: '6px 6px 0 #111',
                width: '100%',
                maxWidth: '440px',
                padding: '2.5rem'
            }}>
                <p className="text-center text-gray-400 mb-8"
                   style={{ fontFamily: "'Courier New', monospace", fontSize: '15px' }}>
                    Đăng nhập để bắt đầu hành trình!
                </p>

                <div className="flex flex-col gap-8">
                    <LoginForm />

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-gray-400 text-sm font-mono">hoặc</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <LoginGoogle />

                    <div className="border-t pt-6">
                        <p className="text-center text-gray-400 text-sm font-mono">
                            Chưa có tài khoản?{' '}
                            <a href="/register" className="text-blue-500 font-bold hover:underline">
                                Đăng ký
                            </a>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}