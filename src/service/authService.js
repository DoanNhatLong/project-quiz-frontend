import axiosInstance from './axiosInstance'

export const getMe = async () => {
    const response = await axiosInstance.get('/auth/me')
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
}

export const getUser = () => {
    return JSON.parse(localStorage.getItem('user'))
}

export const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`
}

export const logout = () => {
    localStorage.removeItem('user')
}