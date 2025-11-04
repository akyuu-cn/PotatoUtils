import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { Helmet } from "react-helmet-async"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function PpiCalc() {
    const ID = "ppi-calc"
    const UTIL = utils.find(u => u.id === ID)

    //

    if (!UTIL) { return null }

    return (
        <div className="mx-auto w-full max-w-screen-lg">

            <Helmet>
                <title>{UTIL.name} - Potato Utils</title>
                <meta name="description" content={UTIL.description} />
            </Helmet>

            <Card className="card mb-4">
                <h1 className="flex items-center">
                    <span className="material-symbols-outlined mr-2">{UTIL.icon}</span>
                    {UTIL.name}
                </h1>
                <div className="mt-2 opacity-75">{UTIL.description}</div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-4!">
                    <span className="material-symbols-outlined mr-2">settings</span>
                    计算图片 PPI
                </h2>
                <div className="opacity-75 mb-8">上传图片，输入图片印刷的尺寸，计算有效 PPI。</div>

                <div className="mb-3 opacity-75">
                    图片选择
                </div>
                <div className="flex flex-col justify-center items-center mb-6 py-15 border-2 border-dashed rounded-md bg-neutral-50 dark:bg-neutral-800">
                    <div className="flex items-center opacity-75">
                        <span className="material-symbols-outlined mr-2">upload</span>
                        <div>
                            点击上传或拖拽图片至此
                        </div>
                    </div>
                    <div className="text-sm opacity-50 mt-2">
                        或在下方手动输入图片尺寸
                    </div>
                </div>

                <div className="text-center opacity-50">

                </div>

                <div className="mb-3 opacity-75">
                    图片尺寸
                </div>
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Input type="number" placeholder="图片宽度 (px)" />
                    <Input type="number" placeholder="图片高度 (px)" />
                </div>

                <div className="mb-3 opacity-75">
                    印刷尺寸
                </div>

                <div className="flex items-center justify-center gap-2 mb-6">
                    <Input type="number" placeholder="印刷宽度 (mm)" />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <span className="material-symbols-outlined">link</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            保持图片长宽比
                        </TooltipContent>
                    </Tooltip>
                    <Input type="number" placeholder="印刷高度 (mm)" />
                </div>

                <div className="mb-3 opacity-75">
                    计算结果
                </div>

                <div>
                    当前图片分辨率为<span className="font-bold"> 0*0</span>，以<span className="font-bold"> 0mm*0mm </span>的尺寸打印，有效 PPI 为<span className="font-bold"> 0 </span>。
                </div>

            </Card>

        </div>
    )
}
