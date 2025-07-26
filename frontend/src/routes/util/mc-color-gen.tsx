import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Helmet } from "react-helmet-async"


export default function McColorGen() {
    const ID = "mc-color-gen"
    const UTIL = utils.find(u => u.id === ID)

    const [inputText, setInputText] = useState("我能吞下玻璃而不伤身体。")
    const [startColor, setStartColor] = useState("#ffcd1a")
    const [endColor, setEndColor] = useState("#ff2e9d")
    const [output, setOutput] = useState("")
    const [coloredChars, setColoredChars] = useState<{ char: string; color: string }[]>([])
    const [mode, setMode] = useState<"json" | "default">("default")
    const [colorSignReplace, setColorSignReplace] = useState("§")
    const [bold, setBold] = useState(false)
    const [italic, setItalic] = useState(false)
    const [underlined, setUnderlined] = useState(false)
    const [strikethrough, setStrikethrough] = useState(false)
    const [obfuscated, setObfuscated] = useState(false)

    useEffect(() => {
        const handler = setTimeout(() => {
            const gradientColorsPerChar = getGradientColorsPerChar(inputText, startColor, endColor)
            setColoredChars(gradientColorsPerChar)
            if (mode === "default") {
                setOutput(gradientColorsPerChar.map(({ char, color }) => {
                    return `${colorSignReplace}${color}${char}`
                }).join(""))
            } else if (mode === "json") {
                setOutput(
                    JSON.stringify(gradientColorsPerChar.map(({ char, color }) => {
                        return {
                            text: char,
                            color: color,
                            bold: bold || undefined,
                            italic: italic || undefined,
                            underlined: underlined || undefined,
                            strikethrough: strikethrough || undefined,
                            obfuscated: obfuscated || undefined,
                        }
                    }))
                )
            }
        }, 10)

        return () => {
            clearTimeout(handler)
        }
    }, [inputText, startColor, endColor, colorSignReplace, mode, bold, italic, underlined, strikethrough, obfuscated])

    function getGradientColorsPerChar(
        text: string,
        startColor: string,
        endColor: string
    ): { char: string; color: string }[] {
        const hexToRgb = (hex: string) => {
            const normalized = hex.replace("#", "")
            const bigint = parseInt(normalized, 16)
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255,
            }
        }

        const rgbToHex = (r: number, g: number, b: number) =>
            "#" +
            [r, g, b]
                .map((x) => {
                    const hex = Math.round(x).toString(16)
                    return hex.length === 1 ? "0" + hex : hex
                })
                .join("")

        const startRGB = hexToRgb(startColor)
        const endRGB = hexToRgb(endColor)
        const length = text.length

        return Array.from(text).map((char, i) => {
            const ratio = length === 1 ? 0 : i / (length - 1) // 避免除以0
            const r = startRGB.r + (endRGB.r - startRGB.r) * ratio
            const g = startRGB.g + (endRGB.g - startRGB.g) * ratio
            const b = startRGB.b + (endRGB.b - startRGB.b) * ratio
            return {
                char,
                color: rgbToHex(r, g, b),
            }
        })
    }

    if (!UTIL) { return null }

    return (
        <div id="dashboard" className="mx-auto w-full max-w-screen-lg">

            <Helmet>
                <title>{UTIL.name} - Potato Utils</title>
                <meta name="description" content={UTIL.description} />
            </Helmet>

            <Card className="relative overflow-hidden card mb-4">
                <h1 className="flex items-center">
                    <span className="material-symbols-outlined mr-2">{UTIL.icon}</span>
                    {UTIL.name}
                </h1>
                <div className="mt-2 opacity-75">
                    <p>
                        生成丝滑的 MC 游戏内可用的渐变文本！
                    </p>
                </div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">preview</span>
                    预览
                </h2>
                <span className="text-3xl mx-auto">
                    {coloredChars.map(({ char, color }, i) => (
                        <span key={i}
                            style={{
                                color,
                                fontWeight: bold ? "bold" : undefined,
                                fontStyle: italic ? "italic" : undefined,
                                textDecoration: [
                                    underlined ? "underline" : "",
                                    strikethrough ? "line-through" : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ") || undefined,
                                filter: obfuscated ? "blur(3px)" : undefined,
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </span>
                <Textarea className="mt-8" readOnly value={output}>

                </Textarea>
            </Card>

            <Card className="mb-4 card">

                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">format_paint</span>
                    基础设置
                </h2>

                <div className="flex flex-row">
                    <div>
                        <div className="text-center opacity-75">起始颜色</div>
                        <input id="color-start-input" className="h-10 w-20 rounded" type="color" value={startColor} onChange={(e) => setStartColor(e.target.value)}></input>
                    </div>
                    <div className="flex-grow h-4 m-3 mt-9" style={{
                        background: `linear-gradient(to right, ${startColor}, ${endColor})`
                    }}>

                    </div>
                    <div className="ml-auto">
                        <div className="text-center opacity-75">终止颜色</div>
                        <input id="color-start-input" className="h-10 w-20" type="color" value={endColor} onChange={(e) => setEndColor(e.target.value)}></input>
                    </div>
                </div>

                <Label className="mb-3 mt-6 opacity-75" htmlFor="text">文本</Label>
                <Input id="text" onChange={(e) => setInputText(e.target.value)} value={inputText}></Input>

            </Card>

            <Card className="card">

                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">design_services</span>
                    高级设置
                </h2>

                <div className="mb-3 opacity-75">
                    生成模式
                </div>

                <ToggleGroup type="single" className="mb-6">
                    <ToggleGroupItem value={"realtime"} aria-checked={mode === "default"} onClick={() => { setMode("default"); setBold(false); setItalic(false); setStrikethrough(false); setUnderlined(false); setObfuscated(false) }}>
                        普通
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"json"} aria-checked={mode === "json"} onClick={() => { setMode("json") }}>
                        JSON
                    </ToggleGroupItem>
                </ToggleGroup>

                {mode === "json" && (<>
                    <div className="mb-3 opacity-75">
                        JSON 生成样式
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex">
                            <Checkbox id="bold" className="mr-3"
                                checked={bold}
                                onCheckedChange={(checked) => setBold(!!checked)}
                            />
                            <Label htmlFor="bold" className="opacity-60">Bold 粗体</Label>
                        </div>
                        <div className="flex">
                            <Checkbox id="italic" className="mr-3"
                                checked={italic}
                                onCheckedChange={(checked) => setItalic(!!checked)}
                            />
                            <Label htmlFor="italic" className="opacity-60">Italic 斜体</Label>
                        </div>
                        <div className="flex">
                            <Checkbox id="strikethrough" className="mr-3"
                                checked={strikethrough}
                                onCheckedChange={(checked) => setStrikethrough(!!checked)}
                            />
                            <Label htmlFor="strikethrough" className="opacity-60">Strikethrough 中划线</Label>
                        </div>
                        <div className="flex">
                            <Checkbox id="underlined" className="mr-3"
                                checked={underlined}
                                onCheckedChange={(checked) => setUnderlined(!!checked)}
                            />
                            <Label htmlFor="underlined" className="opacity-60">Underlined 下划线</Label>
                        </div>
                        <div className="flex">
                            <Checkbox id="obfuscated" className="mr-3"
                                checked={obfuscated}
                                onCheckedChange={(checked) => setObfuscated(!!checked)}
                            />
                            <Label htmlFor="obfuscated" className="opacity-60">Obfuscated 随机字符</Label>
                        </div>
                    </div>
                </>)}


                {mode === "default" && (
                    <div>
                        <div className="mb-3 opacity-75">
                            "§" 符号替换
                        </div>
                        <Input id="colorSignReplace" onChange={(e) => setColorSignReplace(e.target.value)} value={colorSignReplace}></Input>
                    </div>
                )}


            </Card>

        </div>
    )
}
