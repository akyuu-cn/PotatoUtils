import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const cleanInput = (input: string) => input.replace(/[^a-zA-Z]/g, "")

const encodeA1Z26 = (
    text: string,
    separator: string,
    a26z1: boolean,
    offset: number
): string => {
    return cleanInput(text)
        .toUpperCase()
        .split("")
        .map((char) => {
            let code = char.charCodeAt(0) - 65 + 1 // A=1
            if (a26z1) code = 27 - code // A26Z1: A=26, B=25, ..., Z=1
            code += offset
            return code.toString()
        })
        .join(separator)
}

const decodeA1Z26 = (
    input: string,
    separator: string,
    a26z1: boolean,
    offset: number,
    ignoreNonAlphabet: boolean,
    upperCase: boolean
): string => {
    const parts = input
        .split(new RegExp(`[${separator || " "}]+`))
        .filter((s) => s.trim() !== "")

    const letters = parts.map((part) => {
        const num = parseInt(part)
        if (isNaN(num)) return ignoreNonAlphabet ? "" : part
        let val = num - offset
        if (a26z1) val = 27 - val
        if (val < 1 || val > 26) return ignoreNonAlphabet ? "" : part
        const char = String.fromCharCode(val + 64)
        return upperCase ? char : char.toLowerCase()
    })

    return letters.join("")
}

export default function A1z26() {
    const ID = "a1z26"
    const UTIL = utils.find(u => u.id === ID)

    const [alphabet, setAlphabet] = useState("")
    const [copyIconAlphabet, setCopyIconAlphabet] = useState("content_copy")

    const [number, setNumber] = useState("")
    const [copyIconNumber, setCopyIconNumber] = useState("content_copy")

    const [mode, setMode] = useState<"encode" | "decode">("encode")

    const [separator, setSeparator] = useState(" ")
    const [ignoreNonAlphabet, setIgnoreNonAlphabet] = useState(false)
    const [upperCase, setUpperCase] = useState(false)
    const [a26z1, setA26z1] = useState(false)
    const [offset, setOffset] = useState("0")

    useEffect(() => {
        const parsedOffset = parseInt(offset) || 0

        if (mode === "encode") {
            const result = encodeA1Z26(alphabet, separator, a26z1, parsedOffset)
            setNumber(result)
        } else {
            const result = decodeA1Z26(number, separator, a26z1, parsedOffset, ignoreNonAlphabet, upperCase)
            setAlphabet(result)
        }
    }, [
        alphabet,
        number,
        separator,
        a26z1,
        offset,
        upperCase,
        ignoreNonAlphabet,
        mode
    ])


    if (!UTIL) { return null }

    return (
        <div className="mx-auto w-full max-w-screen-lg">

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
                    <span className="material-symbols-outlined mr-2">swap_horiz</span>
                    编解码
                </h2>

                <Textarea
                    readOnly={mode === "decode"}
                    className={cn(mode == "decode" ? "opacity-75" : "", "min-h-30")}
                    placeholder="potato"
                    value={alphabet}
                    onChange={(e) => {
                        setAlphabet(e.target.value)
                    }} />
                <Button variant="ghost" className="ml-auto mt-2 opacity-90 material-symbols-animated-parent" onClick={() => {
                    navigator.clipboard.writeText(alphabet)
                    setCopyIconAlphabet("check")
                    setTimeout(() => {
                        setCopyIconAlphabet("content_copy")
                    }, 1000)
                }}>
                    <span
                        className="material-symbols-outlined material-symbols-animated"
                    >{copyIconAlphabet}</span>
                    复制内容
                </Button>

                <div className="mt-2 mb-10 flex justify-center gap-8">
                    <Button variant={mode === "encode" ? "default" : "outline"} onClick={() => {
                        setMode("encode")
                    }}>
                        <span className="material-symbols-outlined">arrow_cool_down</span>
                        编码
                    </Button>
                    <Button variant={mode === "decode" ? "default" : "outline"} onClick={() => {
                        setMode("decode")
                    }}>
                        <span className="material-symbols-outlined">arrow_warm_up</span>
                        解码
                    </Button>
                </div>

                <Textarea
                    readOnly={mode === "encode"}
                    className={cn(mode == "encode" ? "opacity-75" : "", "min-h-30")}
                    placeholder="16 15 20 1 20 15"
                    value={number}
                    onChange={(e) => {
                        setNumber(e.target.value)
                    }} />
                <Button variant="ghost" className="ml-auto mt-2 opacity-90 material-symbols-animated-parent" onClick={() => {
                    navigator.clipboard.writeText(number)
                    setCopyIconNumber("check")
                    setTimeout(() => {
                        setCopyIconNumber("content_copy")
                    }, 1000)
                }}>
                    <span
                        className="material-symbols-outlined material-symbols-animated"
                    >{copyIconNumber}</span>
                    复制内容
                </Button>
            </Card>

            <Card className="card">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">settings</span>
                    选项
                </h2>
                
                <div className="mb-3 opacity-75">
                    编码
                </div>
                <div className="mb-3 text-sm opacity-50">
                    分隔符
                </div>
                <Input
                    placeholder="分隔符"
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value)}
                />

                <div className="mt-6 mb-3 opacity-75">
                    解码
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex">
                        <Checkbox id="ignoreNonAlphabet" className="mr-3"
                            checked={ignoreNonAlphabet}
                            onCheckedChange={(checked) => setIgnoreNonAlphabet(!!checked)}
                        />
                        <Label htmlFor="ignoreNonAlphabet" className="opacity-60">忽略非字母字符</Label>
                    </div>
                    <div className="flex">
                        <Checkbox id="upperCase" className="mr-3"
                            checked={upperCase}
                            onCheckedChange={(checked) => setUpperCase(!!checked)}
                        />
                        <Label htmlFor="upperCase" className="opacity-60">字母大写</Label>
                    </div>
                </div>

                <div className="mt-6 mb-3 opacity-75">
                    其他
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex">
                        <Checkbox id="a26z1" className="mr-3"
                            checked={a26z1}
                            onCheckedChange={(checked) => setA26z1(!!checked)}
                        />
                        <Label htmlFor="a26z1" className="opacity-60">A26Z1（逆向编码）</Label>
                    </div>
                </div>
                <div className="mt-3 mb-3 text-sm opacity-50">
                    偏移
                </div>
                <Input
                    value={offset}
                    onChange={(e) => setOffset(e.target.value)}
                />


            </Card>

        </div>
    )
}
