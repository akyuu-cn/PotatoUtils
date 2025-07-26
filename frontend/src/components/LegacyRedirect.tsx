import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export function LegacyRedirect() {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const legacyPath = location.pathname.replace(/^\/utils/, "/util")
        navigate(legacyPath, { replace: true })
    }, [location, navigate])

    return null
}
