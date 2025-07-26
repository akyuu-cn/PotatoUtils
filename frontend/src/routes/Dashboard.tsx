import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { hideLaunchpad, showLaunchpad } from "@/components/LaunchpadController"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
    const navigate = useNavigate()
    return (
        <div id="dashboard" className="mx-auto w-full max-w-screen-lg">
            <Card className="card mb-4">
                <h1>
                    🥔 欢迎来到 Potato Utils Reborn！
                </h1>
                <p>
                    Potato Utils 是一个开源、轻量、纯净、快速的 Web 工具集合，致力于为开发者、创作者提供一站式便捷在线工具服务。
                </p>
                <p className="-mt-2">
                    项目处于长期维护的阶段，如果你有任何建议或想贡献新的功能，欢迎前往 Github 提出建议或提交 PR。
                </p>
            </Card>

            <p className="text-center mt-4 opacity-50">
                在下方选择一个操作来开始探索吧。
            </p>

            <div className="items-center justify-center w-full mb-4">
                <Card
                    className="button-card-bg-icon-rotate-parent overflow-hidden relative card card-clickable h-full justify-center"
                    onClick={() => { showLaunchpad() }}
                >
                    <h1 className="flex items-center">
                        <span
                            className="material-symbols-outlined mr-2"
                        >rocket_launch</span>
                        浏览
                    </h1>
                    <div className="opacity-75">浏览所有可用的工具</div>
                    <div className="absolute bottom-0 right-0 -mb-8 -mr-6">
                        <span
                            className="material-symbols-outlined button-card-bg-icon-rotate-mirror text-[128px] opacity-10"
                        >rocket_launch</span>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="items-center justify-center w-full">
                    <Card onClick={() => { navigate("/stats"); hideLaunchpad() }} className="button-card-bg-icon-rotate-parent overflow-hidden relative card card-clickable h-full justify-center">
                        <h1 className="flex items-center">
                            <span
                                className="material-symbols-outlined mr-2"
                            >chart_data</span>
                            统计
                        </h1>
                        <div className="opacity-75">查看站点使用情况数据</div>
                        <div className="absolute bottom-0 right-0 -mb-8 -mr-6">
                            <span
                                className="material-symbols-outlined button-card-bg-icon-rotate text-[128px] opacity-10"
                            >chart_data</span>
                        </div>
                    </Card>
                </div>
                <div className="items-center justify-center w-full">
                    <Card className="button-card-bg-icon-rotate-parent overflow-hidden relative card card-clickable h-full justify-center">
                        <h1 className="flex items-center">
                            <span
                                className="material-symbols-outlined mr-2"
                            >build</span>
                            设置 [WIP]</h1>
                        <div className="opacity-75">调整用户偏好选项</div>
                        <div className="absolute bottom-0 right-0 -mb-6 -mr-6">
                            <span
                                className="material-symbols-outlined button-card-bg-icon-rotate text-[128px] opacity-10"
                            >build</span>
                        </div>
                    </Card>
                </div>
                <div className="items-center justify-center w-full">
                    <Card onClick={() => window.open("https://github.com/akyuu-cn/potatoutils")} className="button-card-bg-icon-rotate-parent overflow-hidden relative card card-clickable h-full justify-center">
                        <h1 className="flex items-center">
                            <span
                                className="material-symbols-outlined mr-2"
                            >folder_code</span>
                            Github 仓库</h1>
                        <div className="opacity-75">访问 Github 仓库</div>
                        <div className="absolute bottom-0 right-0 -mb-6 -mr-6">
                            <span
                                className="material-symbols-outlined button-card-bg-icon-rotate text-[128px] opacity-10"
                            >folder_code</span>
                        </div>
                    </Card>
                </div>
                <div className="items-center justify-center w-full">
                    <Card onClick={() => window.open("https://akyuu.cn")} className="button-card-bg-icon-rotate-parent overflow-hidden relative card card-clickable h-full justify-center">
                        <h1 className="flex items-center">
                            <span
                                className="material-symbols-outlined mr-2"
                            >deployed_code</span>
                            YOIYAMI</h1>
                        <div className="opacity-75">访问 YOIYAMI 主站</div>
                        <div className="absolute bottom-0 right-0 -mb-6 -mr-6">
                            <span
                                className="material-symbols-outlined button-card-bg-icon-rotate text-[128px] opacity-10"
                            >deployed_code</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
