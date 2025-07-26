import { useEffect } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { isMobile } from "@/lib/utils"


export default function Welcome() {
    const closeWelcome = () => {
        localStorage.setItem("welcome", "true")
        document.getElementById("welcome")?.classList.add("fade-out")
        setTimeout(() => {
            document.getElementById("welcome")?.classList.add("hidden")
            document.getElementById("welcome")?.classList.remove("flex")
        }, 200)
    }
    useEffect(() => {
        if (localStorage.getItem("welcome") === null && !isMobile()) {
            document.getElementById("welcome")?.classList.remove("hidden")
            document.getElementById("welcome")?.classList.add("flex")
        }
    }, [])
    return (
        <div id="welcome" className="hidden absolute bottom-0 h-screen w-screen bg-[#11111188] backdrop-blur-md items-center justify-center">
            <div className="">
                <Card className="p-0! flex flex-row overflow-hidden border-2 dark:bg-neutral-800 bg-neutral-100">
                    <div>
                        <img src="/mockup.webp" className="h-130"></img>
                    </div>
                    <div className="p-12 w-150 flex flex-col">
                        <h2 className="flex items-center mb-8!">
                            <span className="material-symbols-outlined mr-2">celebration</span>
                            欢迎来到全新的 Potato Utils Reborn！
                        </h2>
                        <p className="opacity-75">
                            Potato Utils 现已焕然一新！
                        </p>
                        <p className="opacity-75">
                            经过对旧版本的彻底重构，大幅提升了使用体验，包括 UI/UX 改进，页面加载速度优化，换用最新的 WEB 技术栈，对开发者更友好的项目结构。
                        </p>
                        <p className="opacity-75">
                            如果这个工具对你有帮助，欢迎到 GitHub 给我一个 Star ⭐，这对项目的发展非常重要！
                        </p>
                        <p className="opacity-75">
                            此外，你也可以到 GitHub 上提交 Issue 或 Pull request，一起参与到项目的开发中。感谢支持！
                        </p>
                        <div className="mt-auto flex gap-4">
                            <Button onClick={() => window.open("https://github.com/akyuu-cn/potatoutils")} variant={"outline"}>
                                Github 仓库
                            </Button>
                            <Button className="flex-1" onClick={closeWelcome}>
                                关闭
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
