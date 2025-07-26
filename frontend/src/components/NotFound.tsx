import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card } from "./ui/card"

export function NotFound() {
    const navigate = useNavigate()
    return (
        <Card className="card text-center items-center w-full max-w-screen-md mx-auto">
            <div className="text-6xl mb-4">
                404
            </div>
            <div className="mb-4 opacity-75">
                热力猫把页面吃了！
            </div>
            <Button className="" onClick={() => { navigate("/dashboard") }}>
                回到主页
            </Button>
        </Card>

    )
}
