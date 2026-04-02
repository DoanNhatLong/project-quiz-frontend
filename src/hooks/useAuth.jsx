import { useEffect, useState } from 'react'
import { getMe, getUser } from '../service/authService'

export const useAuth = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const cached = getUser()
            if (cached) {
                setUser(cached)
                setLoading(false)
                return
            }

            // Chỉ gọi /auth/me nếu đang ở /home (vừa redirect từ Google về)
            if (window.location.pathname === '/home') {
                try {
                    const data = await getMe()
                    setUser(data)
                } catch {
                    setUser(null)
                }
            }

            setLoading(false)
        }

        checkAuth()
    }, [])

    return { user, loading }
}