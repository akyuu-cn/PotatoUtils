import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import CryptoJS from "crypto-js"
import { useEffect } from "react"
import { Helmet } from "react-helmet-async"


export default function Hash() {
    const ID = "hash"
    const UTIL = utils.find(u => u.id === ID)

    const [mode, setMode] = useState("1")
    const [outputUpper, setOutputUpper] = useState(true)

    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [copyIconOutput, setCopyIconOutput] = useState("content_copy")

    useEffect(() => {
        if (!input) {
            setOutput("")
            return
        }

        const computeHash = async () => {
            let result = ""

            switch (mode) {
                case "1": // MD5
                    result = CryptoJS.MD5(input).toString()
                    break
                case "2": // SHA-1
                    result = await digestMessage(input, "SHA-1")
                    break
                case "3": // SHA-256
                    result = await digestMessage(input, "SHA-256")
                    break
                case "4": // SHA-512
                    result = await digestMessage(input, "SHA-512")
                    break
                default:
                    result = ""
            }

            if (outputUpper) {
                result = result.toUpperCase()
            }
            setOutput(result)
        }

        computeHash()

    }, [input, mode, outputUpper])

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
                <div className="mb-4 opacity-75">
                    哈希算法
                </div>
                <ToggleGroup type="single" className="w-full flex-wrap!">
                    <ToggleGroupItem value={"1"} aria-checked={mode === "1"} onClick={() => { setMode("1") }} >
                        MD5
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"2"} aria-checked={mode === "2"} onClick={() => { setMode("2") }} >
                        SHA-1
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"3"} aria-checked={mode === "3"} onClick={() => { setMode("3") }} >
                        SHA-256
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"4"} aria-checked={mode === "4"} onClick={() => { setMode("4") }} >
                        SHA-512
                    </ToggleGroupItem>
                </ToggleGroup>
                <div className="mt-8 mb-4 opacity-75">
                    字母大小写
                </div>
                <ToggleGroup type="single" className="w-full flex-wrap!">
                    <ToggleGroupItem value={"U"} aria-checked={outputUpper} onClick={() => { setOutputUpper(true) }} >
                        大写
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"L"} aria-checked={!outputUpper} onClick={() => { setOutputUpper(false) }} >
                        小写
                    </ToggleGroupItem>
                </ToggleGroup>
            </Card>

            <Card className="card">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">east</span>
                    编码
                </h2>

                <Textarea
                    className="min-h-30"
                    placeholder="输入"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value)
                    }} />

                <div className="mt-10 mb-10 flex justify-center gap-8">
                    <div className="flex gap-2">
                        <span className="material-symbols-outlined">arrow_cool_down</span>
                        编码
                    </div>
                </div>

                <Textarea
                    readOnly={true}
                    className="opacity-75 min-h-30"
                    placeholder="输出"
                    value={output}
                    onChange={(e) => {
                        setOutput(e.target.value)
                    }} />
                <Button variant="ghost" className="ml-auto mt-2 opacity-90 material-symbols-animated-parent" onClick={() => {
                    navigator.clipboard.writeText(output)
                    setCopyIconOutput("check")
                    setTimeout(() => {
                        setCopyIconOutput("content_copy")
                    }, 1000)
                }}>
                    <span
                        className="material-symbols-outlined material-symbols-animated"
                    >{copyIconOutput}</span>
                    复制内容
                </Button>

            </Card>

        </div>
    )
}

async function digestMessage(message: string, algorithm: "SHA-1" | "SHA-256" | "SHA-512") {
    const encoder = new TextEncoder()
    const data = encoder.encode(message)
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
