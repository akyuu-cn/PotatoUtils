import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export default function RandGen() {
    const ID = "rand-gen"
    const UTIL = utils.find(u => u.id === ID)

    const [mode, setMode] = useState("1")
    const [min, setMin] = useState(1)
    const [max, setMax] = useState(6)

    const [outputSingle, setOutputSingle] = useState("")
    const [outputMulti, setOutputMulti] = useState("")
    const [count, setCount] = useState(10)
    const [split, setSplit] = useState("\n")
    const [copyIconSingle, setCopyIconSingle] = useState("content_copy")
    const [copyIconMulti, setCopyIconMulti] = useState("content_copy")

    const [hideSingle, setHideSingle] = useState(true)
    const [hideMulti, setHideMulti] = useState(true)
    const [alwaysShow, setAlwaysShow] = useState(false)

    useEffect(() => {
        if (mode === "1") {
            setMin(1)
            setMax(6)
        } else if (mode === "2") {
            setMin(1)
            setMax(10)
        } else if (mode === "3") {
            setMin(1)
            setMax(100)
        }
        genSingle()
        genMulti()
    }, [mode, min, max, alwaysShow])

    useEffect(() => {
        genMulti()
    }, [count, split, alwaysShow])

    function genSingle() {
        setOutputSingle(random(min, max).toString())
        setHideSingle(!alwaysShow)
    }

    function genMulti() {
        let _ = []
        if (count <= 0) {
            setOutputMulti("")
        } else if (count > 1000 || length > 50) {
            setOutputMulti("diannaobaozhale")
        } else {
            for (let i = 0; i < count; i++) {
                _.push(random(min, max).toString())
            }
            setOutputMulti(_.join(split))
            setHideMulti(!alwaysShow)
        }
    }

    function random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
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
                    简单的在线随机数生成。
                </div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">settings</span>
                    选项
                </h2>
                <div className="mb-3 opacity-75">
                    范围
                </div>
                <ToggleGroup type="single" className="mb-6 w-full flex-wrap!">
                    <ToggleGroupItem value={"1"} aria-checked={mode === "1"} onClick={() => { setMode("1") }} >
                        1-6
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"2"} aria-checked={mode === "2"} onClick={() => { setMode("2") }} >
                        1-10
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"3"} aria-checked={mode === "3"} onClick={() => { setMode("3") }} >
                        1-100
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"4"} aria-checked={mode === "4"} onClick={() => { setMode("4") }} >
                        自定义
                    </ToggleGroupItem>
                </ToggleGroup>
                {mode === "4" && (<>
                    <div className="mb-4 opacity-75">
                        自定义范围
                    </div>
                    <div className="flex gap-2 flex-col mb-6">
                        <div className="flex gap-4 items-center">
                            <Input placeholder="最小值" className="w-30" disabled={mode !== "4"} onChange={(e) => { setMin(Number(e.target.value)) }} />
                            <div>~</div>
                            <Input placeholder="最大值" className="w-30" disabled={mode !== "4"} onChange={(e) => { setMax(Number(e.target.value)) }} />
                        </div>
                    </div>
                </>)}
                <div className="mb-3 opacity-75">
                    其他
                </div>
                <div className="flex gap-2">
                    <Switch id="always-show" checked={alwaysShow} onCheckedChange={setAlwaysShow} />
                    <Label htmlFor="always-show">自动显示</Label>
                </div>
            </Card>

            {length !== 3300 && (<>
                <Card className="card mb-4">
                    <h2 className="flex items-center mb-8!">
                        <span className="material-symbols-outlined mr-2">looks_one</span>
                        单个随机数生成
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="" onClick={() => { genSingle() }}>
                            <span
                                className="material-symbols-outlined"
                            >refresh</span>
                        </Button>
                        <Button variant="outline" size="icon" className="mr-4 material-symbols-animated-parent" onClick={() => {
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

                        <div className={hideSingle ? "secret-container" : ""} onClick={() => { setHideSingle(false) }}>
                            <div className={hideSingle ? "opacity-50" : "hidden"}>点击显示结果</div>
                            <code className={cn(hideSingle ? "opacity-0! hidden" : "", "transition-all duration-1000 opacity-90 text-2xl")}>{outputSingle}</code>
                        </div>
                    </div>
                </Card>

                <Card className="card">
                    <h2 className="flex items-center mb-8!">
                        <span className="material-symbols-outlined mr-2">list_alt</span>
                        批量随机数生成
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

                        <div className="opacity-75 ml-4">
                            用
                        </div>
                        <Input
                            className="w-30 opacity-75"
                            type="text"
                            value={split}
                            placeholder="<换行符>"
                            onChange={e => {
                                if (e.target.value === "") {
                                    setSplit("\n")
                                } else {
                                    setSplit(e.target.value)
                                }
                            }}
                        />
                        <div className="opacity-75">
                            分割
                        </div>

                    </div>
                    <div className={hideMulti ? "secret-container" : ""} onClick={() => { setHideMulti(false) }}>
                        <div className={hideMulti ? "opacity-50 h-50 flex items-center justify-center" : "hidden"}>点击显示结果</div>
                        <Textarea readOnly className={cn(hideMulti ? "opacity-0! hidden" : "", "font-mono")} value={outputMulti}>
                        </Textarea>
                    </div>
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
