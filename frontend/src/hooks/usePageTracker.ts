import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageTracker() {
    const location = useLocation()
    const lastPathRef = useRef<string | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const pathname = location.pathname

        // 防抖处理：避免重复上报
        if (lastPathRef.current === pathname) return
        lastPathRef.current = pathname

        // 延迟少量时间上报（例如在动画结束后）
        if (timerRef.current) clearTimeout(timerRef.current)

        timerRef.current = setTimeout(() => {
                fetch('/api/visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: pathname }),
            }).catch(err => {
                console.warn('[Tracker] Failed to send visit:', err)
            })
        }, 300)

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [location])
}
