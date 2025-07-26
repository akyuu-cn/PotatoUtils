import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function Base64() {
    const ID = "base64"
    const UTIL = utils.find(u => u.id === ID)

    const [text, setText] = useState("")
    const [copyIconText, setCopyIconText] = useState("content_copy")

    const [base64string, setBase64String] = useState("")
    const [copyIconBase64String, setCopyIconBase64String] = useState("content_copy")

    const [mode, setMode] = useState<"encode" | "decode">("encode")

    const [urlSafe, setUrlSafe] = useState(false)
    const [split76, setSplit76] = useState(false)

    useEffect(() => {
        if (mode !== "encode") return
        try {
            const utf8Bytes = new TextEncoder().encode(text)
            let encoded = btoa(String.fromCharCode(...utf8Bytes))
            if (urlSafe) {
                encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
            }
            if (split76) {
                encoded = encoded.match(/.{1,76}/g)?.join("\n") || encoded
            }
            setBase64String(encoded)
        } catch (err) {
            setBase64String("编码失败：" + String(err))
        }
    }, [text, mode, urlSafe, split76])

    useEffect(() => {
        if (mode !== "decode") return
        try {
            let b64 = base64string.replace(/\n/g, "")
            if (urlSafe) {
                b64 = b64.replace(/-/g, "+").replace(/_/g, "/")
                while (b64.length % 4 !== 0) {
                    b64 += "="
                }
            }
            const binary = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
            const decoded = new TextDecoder().decode(binary)
            setText(decoded)
        } catch (err) {
            setText("解码失败：" + String(err))
        }
    }, [base64string, mode, urlSafe])

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
                    placeholder="PotatoUtils"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value)
                    }} />
                <Button variant="ghost" className="ml-auto mt-2 opacity-90 material-symbols-animated-parent" onClick={() => {
                    navigator.clipboard.writeText(text)
                    setCopyIconText("check")
                    setTimeout(() => {
                        setCopyIconText("content_copy")
                    }, 1000)
                }}>
                    <span
                        className="material-symbols-outlined material-symbols-animated"
                    >{copyIconText}</span>
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
                    placeholder="UG90YXRvVXRpbHM="
                    value={base64string}
                    onChange={(e) => {
                        setBase64String(e.target.value)
                    }} />
                <Button variant="ghost" className="ml-auto mt-2 opacity-90 material-symbols-animated-parent" onClick={() => {
                    navigator.clipboard.writeText(base64string)
                    setCopyIconBase64String("check")
                    setTimeout(() => {
                        setCopyIconBase64String("content_copy")
                    }, 1000)
                }}>
                    <span
                        className="material-symbols-outlined material-symbols-animated"
                    >{copyIconBase64String}</span>
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
                <div className="flex flex-col gap-3">
                    <div className="flex">
                        <Checkbox id="urlSafe" className="mr-3"
                            checked={urlSafe}
                            onCheckedChange={(checked) => setUrlSafe(!!checked)}
                        />
                        <Label htmlFor="urlSafe" className="opacity-60">Base64URL（URL 安全）</Label>
                    </div>
                    <div className="flex">
                        <Checkbox id="split76" className="mr-3"
                            checked={split76}
                            onCheckedChange={(checked) => setSplit76(!!checked)}
                        />
                        <Label htmlFor="split76" className="opacity-60">每 76 个字符换行（MIME 兼容）</Label>
                    </div>
                </div>

            </Card>

        </div>
    )
}
