import utils from "@/static/utils.json"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Helmet } from "react-helmet-async"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function PpiCalc() {
    const ID = "ppi-calc"
    const UTIL = utils.find(u => u.id === ID)
    if (!UTIL) return null

    // ---------- 状态 ----------
    const [pxW, setPxW] = useState<number | undefined>()
    const [pxH, setPxH] = useState<number | undefined>()
    const [mmW, setMmW] = useState<number | undefined>()
    const [mmH, setMmH] = useState<number | undefined>()
    const [lockRatio, setLockRatio] = useState(true)
    const [manualResolution, setManualResolution] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setPxW(undefined)
        setPxH(undefined)
        setMmW(undefined)
        setMmH(undefined)
    }, [manualResolution])

    // ---------- 自动维持图片比例 ----------
    const handleMmWidthChange = (v: number) => {
        setMmW(v)
        if (lockRatio && pxW && pxH) {
            const ratio = pxH / pxW
            setMmH(Number((v * ratio).toFixed(2)))
        }
    }

    const handleMmHeightChange = (v: number) => {
        setMmH(v)
        if (lockRatio && pxW && pxH) {
            const ratio = pxW / pxH
            setMmW(Number((v * ratio).toFixed(2)))
        }
    }

    // ---------- 上传图片获取分辨率 ----------
    const onSelectImage = async (file: File) => {
        const img = new Image()
        img.src = URL.createObjectURL(file)
        await img.decode()
        setPxW(img.width)
        setPxH(img.height)
    }

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.dataTransfer.files?.[0]) {
            onSelectImage(e.dataTransfer.files[0])
        }
    }

    // ---------- 计算有效 PPI ----------
    const calcPPI = () => {
        if (!pxW || !pxH || !mmW || !mmH) return 0
        const inchW = mmW / 25.4
        const inchH = mmH / 25.4
        const ppiW = pxW / inchW
        const ppiH = pxH / inchH
        return Math.round((ppiW + ppiH) / 2)
    }

    const ppi = calcPPI()

    // ---------- 第二模块：反向计算目标分辨率 ----------
    const [targetPPI, setTargetPPI] = useState<number | undefined>(300)
    const [ratioW, setRatioW] = useState<number | undefined>()
    const [ratioH, setRatioH] = useState<number | undefined>()
    const [mmW2, setMmW2] = useState<number | undefined>()
    const [mmH2, setMmH2] = useState<number | undefined>()
    const [lockRatio2, setLockRatio2] = useState(true)

    const handle2MmWidthChange = (v: number) => {
        setMmW2(v)
        if (lockRatio2 && ratioW && ratioH) {
            setMmH2(Number((v * ratioH / ratioW).toFixed(2)))
        }
    }

    const handle2MmHeightChange = (v: number) => {
        setMmH2(v)
        if (lockRatio2 && ratioW && ratioH) {
            setMmW2(Number((v * ratioW / ratioH).toFixed(2)))
        }
    }

    const calcTargetPx = () => {
        if (!targetPPI || !ratioW || !ratioH || !mmW2 || !mmH2) return { w: 0, h: 0 }
        const inchW = mmW2 / 25.4
        const inchH = mmH2 / 25.4
        const px_w = Math.round(targetPPI * inchW)
        const px_h = Math.round(targetPPI * inchH)
        return { w: px_w, h: px_h }
    }

    const targetPx = calcTargetPx()

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

            {/* ----------- 第一块：计算有效PPI ----------- */}
            <Card className="card mb-4">
                <h2 className="flex items-center mb-4!">
                    <span className="material-symbols-outlined mr-2">settings</span>
                    计算图片 PPI
                </h2>
                <div className="opacity-75 mb-4">上传图片（或手动输入图片分辨率），输入图片印刷的尺寸，计算有效 PPI。</div>


                <ToggleGroup type="single" className="mb-6 w-full flex-wrap!">
                    <ToggleGroupItem value={"1"} aria-checked={manualResolution === false} onClick={() => { setManualResolution(false) }} >
                        上传图片获取分辨率
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"2"} aria-checked={manualResolution === true} onClick={() => { setManualResolution(true) }} >
                        手动填写图片分辨率
                    </ToggleGroupItem>
                </ToggleGroup>

                {!manualResolution && (<>
                    <div className="mb-3 opacity-75">
                        图片选择
                    </div>

                    <div
                        className="flex flex-col justify-center items-center mb-6 py-15 border-2 border-dashed rounded-md bg-neutral-50 dark:bg-neutral-800 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={onDrop}
                        onDragOver={e => e.preventDefault()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                                if (e.target.files?.[0]) onSelectImage(e.target.files[0])
                            }}
                        />

                        <div className="flex items-center opacity-75">
                            <span className="material-symbols-outlined mr-2">upload</span>
                            <div>点击上传或拖拽图片至此</div>
                        </div>
                        {pxW && pxH && (
                            <div className="text-sm mt-2">已读取：{pxW} × {pxH}px</div>
                        )}
                    </div>
                </>)}

                {manualResolution && (<>
                    <div className="mb-3 opacity-75">图片分辨率</div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Input type="number" placeholder="横向 (px)"
                            value={pxW ?? ""}
                            onChange={e => setPxW(Number(e.target.value))}
                        />
                        <Input type="number" placeholder="纵向 (px)"
                            value={pxH ?? ""}
                            onChange={e => setPxH(Number(e.target.value))}
                        />
                    </div>
                </>)}

                <div className="mb-3 opacity-75">印刷尺寸</div>
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Input type="number" placeholder="宽 (mm)"
                        value={mmW ?? ""}
                        onChange={e => handleMmWidthChange(Number(e.target.value))}
                    />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setLockRatio(!lockRatio)}>
                                <span className="material-symbols-outlined">
                                    {lockRatio ? "link" : "link_off"}
                                </span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            保持图片长宽比
                        </TooltipContent>
                    </Tooltip>
                    <Input type="number" placeholder="高 (mm)"
                        value={mmH ?? ""}
                        onChange={e => handleMmHeightChange(Number(e.target.value))}
                    />
                </div>

                <div className="mb-3 opacity-75">计算结果</div>
                <div>
                    当前图片分辨率为 <b>{pxW ?? 0}×{pxH ?? 0}</b>，
                    以 <b>{mmW ?? 0}mm×{mmH ?? 0}mm</b> 尺寸印刷，
                    有效 PPI 为 <b>{ppi}</b>。
                </div>
            </Card>

            {/* ----------- 第二块：计算需要的像素 ----------- */}
            <Card className="card mb-4">
                <h2 className="flex items-center mb-4!">
                    <span className="material-symbols-outlined mr-2">settings</span>
                    计算目标图片分辨率
                </h2>
                <div className="opacity-75 mb-8">输入目标PPI、图片比例和印刷尺寸，计算目标图片分辨率。</div>

                <div className="mb-3 opacity-75">目标PPI</div>
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Input type="number" placeholder="目标PPI"
                        value={targetPPI ?? ""}
                        onChange={e => setTargetPPI(Number(e.target.value))}
                    />
                </div>

                <div className="mb-3 opacity-75">图片比例</div>
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Input type="number" placeholder=""
                        value={ratioW ?? ""}
                        onChange={e => setRatioW(Number(e.target.value))}
                    />
                    <div>:</div>
                    <Input type="number" placeholder=""
                        value={ratioH ?? ""}
                        onChange={e => setRatioH(Number(e.target.value))}
                    />
                </div>

                <div className="mb-3 opacity-75">印刷尺寸</div>
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Input type="number" placeholder="宽 (mm)"
                        value={mmW2 ?? ""}
                        onChange={e => handle2MmWidthChange(Number(e.target.value))}
                    />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setLockRatio2(!lockRatio2)}>
                                <span className="material-symbols-outlined">
                                    {lockRatio2 ? "link" : "link_off"}
                                </span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            保持图片长宽比
                        </TooltipContent>
                    </Tooltip>
                    <Input type="number" placeholder="高 (mm)"
                        value={mmH2 ?? ""}
                        onChange={e => handle2MmHeightChange(Number(e.target.value))}
                    />
                </div>

                <div className="mb-3 opacity-75">
                    计算结果
                </div>

                <div>
                    当前目标 PPI 为
                    <span className="font-bold"> {targetPPI ?? 0} </span>，
                    以
                    <span className="font-bold"> {ratioW ?? 0}:{ratioH ?? 0} </span>
                    的比例，
                    <span className="font-bold"> {mmW2 ?? 0}mm*{mmH2 ?? 0}mm </span>
                    的尺寸印刷，需要达到的图片分辨率为
                    <span className="font-bold"> {targetPx.w}*{targetPx.h} </span>。
                </div>

            </Card>

        </div>
    )
}
