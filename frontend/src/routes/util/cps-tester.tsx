import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Progress } from "@/components/ui/progress"
import { useEffect, useRef, useState } from "react"

export default function CpsTester() {
    const ID = "cps-tester"
    const UTIL = utils.find(u => u.id === ID)
    const [mode, setMode] = useState("realtime")
    const [text, setText] = useState("...")
    const [cps, setCps] = useState(0)

    const [clicks, setClicks] = useState(0)
    const clicksRef = useRef(0)
    const [status, setStatus] = useState<"end" | "active" | "wait">("end")
    const intervalRef = useRef<any>(null)

    const [progress, setProgress] = useState(0)

    function click() {
        if (mode === "realtime") {
            cpsAdd()
            setTimeout(() => {
                cpsSub()
            }, 1000)
        } else if (mode === "average") {
            if (status === "end") {
                setStatus("active")
                setClicks(0)
                const ts = Date.now()
                intervalRef.current = setInterval(() => {
                    setProgress(100 - (Date.now() - ts) / 10000 * 100)
                    if (Date.now() - ts >= 10000) {
                        setStatus("wait")
                        setTimeout(() => {
                            setStatus("end")
                        }, 3000)
                        clearInterval(intervalRef.current)
                        setText(`${clicksRef.current / 10} CPS (10S avg.)`)
                    }
                }, 100)
            }
            clicksAdd()
        }
    }

    function cpsAdd() {
        setCps(prev => prev + 1)
    }

    function cpsSub() {
        setCps(prev => prev - 1)
    }

    function clicksAdd() {
        setClicks(prev => {
            clicksRef.current = prev + 1
            return prev + 1
        })
    }

    useEffect(() => {
        if (mode === "realtime") {
            setText(`${cps} CPS`)
            setProgress(cps * 5)
        } else if (mode === "average") {
            setText(`${clicks} CLICK(S)`)
        }
    }, [cps, clicks])

    useEffect(() => {
        if (mode === "average") {
            setProgress(100)
        } else {
            setProgress(0)
        }
    }, [mode])

    if (!UTIL) { return null }

    return (
        <div className="mx-auto w-full max-w-screen-lg">

            <Card className="relative overflow-hidden card mb-4">
                <h1 className="flex items-center">
                    <span className="material-symbols-outlined mr-2">{UTIL.icon}</span>
                    {UTIL.name}
                </h1>
                <div className="mt-2 opacity-75">
                    <p>
                        CPS 即 Click Per Second，每秒点击次数。在本页面里有两种测量模式。
                    </p>
                    <p><b>实时 CPS</b>：根据点击速度实时变化。</p>
                    <p><b>10S 平均值</b>：持续点击十秒，十秒后计算平均值。</p>
                </div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">settings</span>
                    选项
                </h2>
                <div className="mb-3 opacity-75">
                    测量模式
                </div>
                <ToggleGroup type="single" className="w-full flex-wrap!">
                    {/* {["realtime", "average"].map((val, idx) => (
                        <ToggleGroupItem
                            key={val}
                            value={val}
                            aria-checked={mode === val}
                            onClick={() => setMode(val)}
                        >
                            {val}
                        </ToggleGroupItem>
                    ))} */}
                    <ToggleGroupItem value={"realtime"} aria-checked={mode === "realtime"} onClick={() => { setMode("realtime"); setText("- 实时 CPS -") }} disabled={status === "active" || cps !== 0}>
                        实时 CPS
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"average"} aria-checked={mode === "average"} onClick={() => { setMode("average"); setText("- 10S 平均值 -") }} disabled={status === "active" || cps !== 0}>
                        10S 平均值
                    </ToggleGroupItem>
                </ToggleGroup>
            </Card>

            <Card className="card mb-4 overflow-hidden">

                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">straighten</span>
                    测量
                </h2>

                <div className="mb-8 text-center my-auto justify-self-center font-bold text-4xl">
                    {text}
                </div>
                <Progress className="mb-6" value={progress} />

                {/* <ToggleGroup type="single" className="mb-4">
                    <ToggleGroupItem value={"realtime"} aria-checked={mode === "realtime"} onClick={() => { setMode("realtime"); setText("- 实时 CPS -") }} disabled={status === "active" || cps !== 0}>
                        实时 CPS
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"average"} aria-checked={mode === "average"} onClick={() => { setMode("average"); setText("- 10S 平均值 -") }} disabled={status === "active" || cps !== 0}>
                        10S 平均值
                    </ToggleGroupItem>
                </ToggleGroup> */}
                <Button className="h-50 font-bold text-xl active:dark:bg-neutral-400 active:bg-neutral-950" onClick={click} disabled={status === "wait"}>
                    CLICK HERE!
                </Button>
            </Card>

        </div>
    )
}
