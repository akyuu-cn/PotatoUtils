import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"

import * as sspg from "sspg"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export default function Spg() {
    const ID = "spg"
    const UTIL = utils.find(u => u.id === ID)

    const [mode, setMode] = useState("1")
    const [numberEnabled, setNumberEnabled] = useState(true)
    const [lowercaseEnabled, setLowcaseEnabled] = useState(true)
    const [uppercaseEnabled, setUppercaseEnabled] = useState(true)
    const [dashEnabled, setDashEnabled] = useState(true)
    const [specialEnabled, setSpecialEnabled] = useState(true)
    const [extraEnabled, setExtraEnabled] = useState(true)
    const [custom, setCustom] = useState("")
    const [length, setLength] = useState(20)

    const [outputSingle, setOutputSingle] = useState("")
    const [outputMulti, setOutputMulti] = useState("")
    const [count, setCount] = useState(10)
    const [copyIconSingle, setCopyIconSingle] = useState("content_copy")
    const [copyIconMulti, setCopyIconMulti] = useState("content_copy")


    useEffect(() => {
        if (mode === "1") {
            setNumberEnabled(s => true)
            setLowcaseEnabled(s => true)
            setUppercaseEnabled(s => true)
            setDashEnabled(s => false)
            setSpecialEnabled(s => false)
            setExtraEnabled(s => false)
        } else if (mode === "2") {
            setNumberEnabled(s => true)
            setLowcaseEnabled(s => true)
            setUppercaseEnabled(s => true)
            setDashEnabled(s => false)
            setSpecialEnabled(s => true)
            setExtraEnabled(s => false)
        } else if (mode === "3") {
            setNumberEnabled(s => true)
            setLowcaseEnabled(s => true)
            setUppercaseEnabled(s => true)
            setDashEnabled(s => true)
            setSpecialEnabled(s => true)
            setExtraEnabled(s => true)
        }
        genSingle()
        genMulti()
    }, [mode, numberEnabled, lowercaseEnabled, uppercaseEnabled, dashEnabled, specialEnabled, extraEnabled, custom, length])

    useEffect(() => {
        genMulti()
    }, [count])

    function genSingle() {
        setOutputSingle(sspg.gens(getSpgFormat(), length))
    }

    function genMulti() {
        let _ = []
        if (count <= 0) {
            setOutputMulti("")
        } else if (count > 1000 || length > 50) {
            setOutputMulti("diannaobaozhale")
        } else {
            for (let i = 0; i < count; i++) {
                _.push(sspg.gens(getSpgFormat(), length))
            }
            setOutputMulti(_.join("\n"))
        }
    }

    function getSpgFormat() {
        let _ = ""
        if (numberEnabled) {
            _ += "0"
        }
        if (lowercaseEnabled) {
            _ += "a"
        }
        if (uppercaseEnabled) {
            _ += "A"
        }
        if (dashEnabled) {
            _ += "-_"
        }
        if (specialEnabled) {
            _ += "."
        }
        if (extraEnabled) {
            _ += "["
        }
        if (custom != "") {
            _ += `c${custom}`
        }
        return _
    }

    if (!UTIL) { return null }

    return (
        <div className="mx-auto w-full max-w-screen-lg">

            <Card className="card mb-4">
                <h1 className="flex items-center">
                    <span className="material-symbols-outlined mr-2">{UTIL.icon}</span>
                    {UTIL.name}
                </h1>
                <div className="mt-2 opacity-75">
                    <a href="https://github.com/lingrottin/sspg.js" target="_blank" >sspg.js</a> 的在线版本。
                </div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">settings</span>
                    选项
                </h2>
                <div className="mb-3 opacity-75">
                    字符集
                </div>
                <ToggleGroup type="single" className="mb-2 w-full flex-wrap!">
                    <ToggleGroupItem value={"1"} aria-checked={mode === "1"} onClick={() => { setMode("1") }} >
                        数字、字母
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"2"} aria-checked={mode === "2"} onClick={() => { setMode("2") }} >
                        数字、字母、符号
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"3"} aria-checked={mode === "3"} onClick={() => { setMode("3") }} >
                        全部
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"4"} aria-checked={mode === "4"} onClick={() => { setMode("4") }} >
                        自定义
                    </ToggleGroupItem>
                </ToggleGroup>
                {mode === "4" && (<>
                    <div className="mb-5 opacity-75 mt-6">
                        自定义选项
                    </div>
                    <div className="flex gap-2 mb-4 flex-col">
                        <div className="flex gap-2 mb-5">
                            <Switch id="number" disabled={mode !== "4"} checked={numberEnabled} onCheckedChange={setNumberEnabled} />
                            <Label htmlFor="number">0 ~ 9</Label>
                        </div>
                        <div className="flex gap-2 mb-5">
                            <Switch id="lowcase" disabled={mode !== "4"} checked={lowercaseEnabled} onCheckedChange={setLowcaseEnabled} />
                            <Label htmlFor="lowcase">a ~ z</Label>
                        </div>
                        <div className="flex gap-2 mb-5">
                            <Switch id="uppercase" disabled={mode !== "4"} checked={uppercaseEnabled} onCheckedChange={setUppercaseEnabled} />
                            <Label htmlFor="uppercase">A ~ Z</Label>
                        </div>
                        <div className="flex gap-2 mb-5">
                            <Switch id="dash" disabled={mode !== "4"} checked={dashEnabled} onCheckedChange={setDashEnabled} />
                            <Label htmlFor="dash">-_</Label>
                        </div>
                        <div className="flex gap-2 mb-5">
                            <Switch id="special" disabled={mode !== "4"} checked={specialEnabled} onCheckedChange={setSpecialEnabled} />
                            <Label htmlFor="special">{`!@#$%^&*,.;:/?+=`}</Label>
                        </div>
                        <div className="flex gap-2 mb-3">
                            <Switch id="extra" disabled={mode !== "4"} checked={extraEnabled} onCheckedChange={setExtraEnabled} />
                            <Label htmlFor="extra">{`()[]{}<>|""\`~`}</Label>
                        </div>
                        <div>
                            <Input placeholder="额外自定义字符" className="w-70" disabled={mode !== "4"} checked={extraEnabled} onChange={(e) => { setCustom(e.target.value) }} />
                        </div>
                    </div>
                </>)}
                <div className="mt-4 mb-3 opacity-75">
                    长度
                </div>
                <Slider
                    min={5}
                    max={51}
                    step={5}
                    defaultValue={[20]}
                    onValueChange={(value) => {
                        if (value[0] === 51) {
                            setLength(3300)
                        } else {
                            setLength(value[0])
                        }
                    }}
                />
                <div
                    className={cn(
                        length === 3300 ? "opacity-100! font-black text-4xl! rainbow-text" : "",
                        "text-center opacity-50 text-sm mx-auto mt-3"
                    )}
                >{length} 位</div>
            </Card>

            {length !== 3300 && (<>
                <Card className="card mb-4">
                    <h2 className="flex items-center mb-8!">
                        <span className="material-symbols-outlined mr-2">looks_one</span>
                        单个密钥生成
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="" onClick={() => { genSingle() }}>
                            <span
                                className="material-symbols-outlined"
                            >refresh</span>
                        </Button>
                        <Button variant="outline" size="icon" className="material-symbols-animated-parent" onClick={() => {
                            navigator.clipboard.writeText(outputSingle)
                            setCopyIconSingle("check")
                            setTimeout(() => {
                                setCopyIconSingle("content_copy")
                            }, 1000)
                        }}>
                            <span
                                className="material-symbols-outlined material-symbols-animated"
                            >{copyIconSingle}</span>
                        </Button>

                        <code className="opacity-90 text-2xl ml-4">{outputSingle}</code>
                    </div>
                </Card>

                <Card className="card">
                    <h2 className="flex items-center mb-8!">
                        <span className="material-symbols-outlined mr-2">list_alt</span>
                        批量密钥生成
                    </h2>
                    <div className="flex items-center gap-2 mb-4">


                        <Button variant="outline" size="icon" className="" onClick={() => { genMulti() }}>
                            <span
                                className="material-symbols-outlined"
                            >refresh</span>
                        </Button>

                        <Button variant="outline" size="icon" className="material-symbols-animated-parent" onClick={() => {
                            navigator.clipboard.writeText(outputMulti)
                            setCopyIconMulti("check")
                            setTimeout(() => {
                                setCopyIconMulti("content_copy")
                            }, 1000)
                        }}>
                            <span
                                className="material-symbols-outlined material-symbols-animated"
                            >{copyIconMulti}</span>

                        </Button>


                        <div className="opacity-75 ml-4">
                            生成
                        </div>
                        <Input
                            className="w-30 opacity-75"
                            type="number"
                            value={count}
                            onChange={e => {
                                setCount(parseInt(e.target.value))
                            }}
                        />
                        <div className="opacity-75">
                            个
                        </div>
                    </div>
                    <Textarea readOnly className="font-mono" value={outputMulti}>
                    </Textarea>
                </Card>
            </>)}

            {length === 3300 && (<>
                <Card className="card opacity-90">
                    <div className="break-all font-mono">
                        {outputSingle}
                    </div>
                </Card>
            </>)}

        </div>
    )
}
