import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { Helmet } from "react-helmet-async"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import ComputingSign from "@/components/ComputingSign"
import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"


export default function QrCode() {
    const ID = "qr-code"
    const UTIL = utils.find(u => u.id === ID)

    const [text, setText] = useState("")
    const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M")
    const [size, setSize] = useState(10)
    const [margin, setMargin] = useState(2)

    const [svg, setSvg] = useState("")
    const [png, setPng] = useState("")
    const [error, setError] = useState("")
    const [computing, setComputing] = useState(false)

    const [copyIconSvg, setCopyIconSvg] = useState("content_copy")
    const [copyIconPng, setCopyIconPng] = useState("content_copy")

    const svgRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(0)

    // 监听容器宽度变化，实时更新二维码尺寸，防止溢出容器
    useEffect(() => {
        const el = containerRef.current
        if (!el) { return }

        const update = () => { setContainerWidth(el.clientWidth) }
        update()

        const observer = new ResizeObserver(update)
        observer.observe(el)
        return () => { observer.disconnect() }
    }, [])

    // 二维码原始像素尺寸
    const naturalSize = size * 32
    // 最多缩放到 100%，仅在超出容器宽度时缩小
    const scale = containerWidth > 0
        ? Math.min(1, containerWidth / naturalSize)
        : 1
    const displaySize = Math.round(naturalSize * scale)
    const isScaledDown = scale < 1



    // 节流
    const requestIdRef = useRef(0)

    useEffect(() => {
        if (!text) {
            setSvg("")
            setPng("")
            setError("")
            setComputing(false)
            return
        }

        setComputing(true)
        const requestId = ++requestIdRef.current
        const isCancelled = () => requestIdRef.current !== requestId

        const timer = setTimeout(() => {
            void (async () => {
                try {
                    const options: QRCode.QRCodeToDataURLOptions = {
                        errorCorrectionLevel: level,
                        margin,
                        width: size * 32,
                    }

                    const svgString = await QRCode.toString(text, {
                        ...options,
                        type: "svg",
                    })

                    const pngDataUrl = await QRCode.toDataURL(text, {
                        ...options,
                        type: "image/png",
                    })

                    // 已有更新的请求发出，丢弃本次过期结果
                    if (isCancelled()) { return }
                    setSvg(svgString)
                    setPng(pngDataUrl)
                    setError("")
                } catch (e) {
                    if (isCancelled()) { return }
                    setSvg("")
                    setPng("")
                    setError(e instanceof Error ? e.message : "生成失败")
                } finally {
                    if (!isCancelled()) { setComputing(false) }
                }
            })()
        }, 250)

        return () => clearTimeout(timer)
    }, [text, level, size, margin])

    function flashCopyIcon(setter: (v: string) => void) {
        setter("check")
        setTimeout(() => {
            setter("content_copy")
        }, 1000)
    }

    async function copySvg() {
        if (!svg) { return }
        await navigator.clipboard.writeText(svg)
        flashCopyIcon(setCopyIconSvg)
    }

    async function copyPng() {
        if (!png) { return }
        try {
            const blob = await (await fetch(png)).blob()
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
            ])
        } catch {
            await navigator.clipboard.writeText(png)
        }
        flashCopyIcon(setCopyIconPng)
    }

    function downloadSvg() {
        if (!svg) { return }
        const blob = new Blob([svg], { type: "image/svg+xml" })
        triggerDownload(URL.createObjectURL(blob), "qrcode.svg")
    }

    function downloadPng() {
        if (!png) { return }
        triggerDownload(png, "qrcode.png")
    }

    function triggerDownload(href: string, filename: string) {
        const a = document.createElement("a")
        a.href = href
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        if (href.startsWith("blob:")) {
            URL.revokeObjectURL(href)
        }
    }

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
                <div className="mt-2 opacity-75">
                    {UTIL.description}
                </div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">settings</span>
                    选项
                </h2>
                <Textarea
                    className="min-h-30 mb-8"
                    placeholder="输入二维码需要携带的信息"
                    value={text}
                    onChange={(e) => { setText(e.target.value) }} />


                <div className="mb-3 opacity-75">纠错级别</div>
                <ToggleGroup
                    type="single"
                    className="mb-8 w-full flex-wrap!"
                    value={level}
                    onValueChange={(v) => { if (v) { setLevel(v as "L" | "M" | "Q" | "H") } }}>
                    <ToggleGroupItem value="L">
                        L / 7%
                    </ToggleGroupItem>
                    <ToggleGroupItem value="M">
                        M / 15%
                    </ToggleGroupItem>
                    <ToggleGroupItem value="Q">
                        Q / 25%
                    </ToggleGroupItem>
                    <ToggleGroupItem value="H">
                        H / 30%
                    </ToggleGroupItem>
                </ToggleGroup>


                <div className="mb-3 opacity-75">
                    尺寸
                </div>
                <Slider
                    min={5}
                    max={50}
                    step={5}
                    value={[size]}
                    onValueChange={(v) => { setSize(v[0]) }}
                />
                <div
                    className={"text-center opacity-50 text-sm mx-auto mt-3 mb-6"}
                >{size * 32}x{size * 32}</div>


                <div className="mb-3 opacity-75">
                    边距
                </div>
                <Slider
                    min={0}
                    max={8}
                    step={1}
                    value={[margin]}
                    onValueChange={(v) => { setMargin(v[0]) }}
                />
                <div
                    className={"text-center opacity-50 text-sm mx-auto mt-3"}
                >{margin} 格</div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">output</span>
                    输出
                    {computing && <ComputingSign />}
                </h2>
                <div className="mb-6 flex flex-col items-center justify-center">
                    <div
                        ref={containerRef}
                        className="relative w-full flex items-center justify-center overflow-hidden"
                    >
                        {svg ? (
                            <div
                                ref={svgRef}
                                className="[&>svg]:w-full [&>svg]:h-full"
                                style={{ width: displaySize, height: displaySize }}
                                dangerouslySetInnerHTML={{ __html: svg }}
                            />
                        ) : (
                            <div className="bg-neutral-200 dark:bg-neutral-700 opacity-50 w-80 h-80 flex items-center justify-center text-center text-sm px-4">
                                {error || "输入内容后生成二维码"}
                            </div>
                        )}
                    </div>
                    {svg && isScaledDown && (
                        <div className="text-sm opacity-60 mt-6">
                            预览已缩小，实际尺寸 {naturalSize}x{naturalSize}
                        </div>
                    )}
                </div>
                <div className="flex-grow flex gap-2 justify-center flex-wrap">
                    <Button
                        className="material-symbols-animated-parent"
                        variant="default"
                        disabled={!svg}
                        onClick={downloadSvg}>
                        <span
                            className="material-symbols-outlined material-symbols-animated "
                        >download</span> SVG
                    </Button>
                    <Button
                        className="material-symbols-animated-parent"
                        variant="default"
                        disabled={!svg}
                        onClick={copySvg}>
                        <span
                            className="material-symbols-outlined material-symbols-animated "
                        >{copyIconSvg}</span> SVG
                    </Button>
                    <Button
                        className="material-symbols-animated-parent"
                        variant="outline"
                        disabled={!png}
                        onClick={downloadPng}>
                        <span
                            className="material-symbols-outlined material-symbols-animated "
                        >download</span> PNG
                    </Button>
                    <Button
                        className="material-symbols-animated-parent"
                        variant="outline"
                        disabled={!png}
                        onClick={copyPng}>
                        <span
                            className="material-symbols-outlined material-symbols-animated "
                        >{copyIconPng}</span> PNG
                    </Button>
                </div>
            </Card>
        </div>
    )
}
