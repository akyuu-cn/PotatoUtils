import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"

export default function BpmTapper() {
    const ID = "bpm-tapper"
    const UTIL = utils.find(u => u.id === ID)

    const [beatType, setBeatType] = useState(4)
    const [accuracy, setAccuracy] = useState(1)
    const [bpm, setBpm] = useState<number | null>(null)
    const [visualBeats, setVisualBeats] = useState<string | null>(null)
    const [showBrackets, setShowBrackets] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const startTimeRef = useRef<number[]>([])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault()
                click()
            }
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [beatType, accuracy])

    useEffect(() => {
        reset()
    }, [beatType, accuracy])

    function click() {
        const now = Date.now()
        const timestamps = [...startTimeRef.current, now]
        if (timestamps.length > 1) {
            const intervals = timestamps.slice(1).map((t, i) => t - timestamps[i])
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
            let resultBpm = 60000 / avgInterval

            switch (accuracy) {
                case 1:
                    resultBpm = Math.round(resultBpm)
                    break
                case 2:
                    resultBpm = Math.round(resultBpm * 2) / 2
                    break
                case 3:
                    resultBpm = Math.round(resultBpm * 10) / 10
                    break
                case 4:
                    resultBpm = Math.round(resultBpm * 100) / 100
                    break
            }

            setBpm(resultBpm)
            updateVisual(timestamps.length)
            setShowBrackets(false)
        }
        else {
            setBpm(null)
            setVisualBeats("★")
            setShowBrackets(false)
        }

        startTimeRef.current = timestamps

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            setShowBrackets(true)
            startTimeRef.current = []
        }, 3000)
    }

    function reset() {
        setBpm(null)
        setVisualBeats(null)
        setShowBrackets(false)
        startTimeRef.current = []
    }

    function updateVisual(count: number) {
        const beatPerBar = beatType
        const beats = Array(count).fill("★").map((b, i) => ((i + 1) % beatPerBar === 0 ? b + " |" : b)).join(" ")
        setVisualBeats(beats.trim())
    }

    if (!UTIL) return null

    return (
        <div className="mx-auto w-full max-w-screen-lg">

            <Card className="card mb-4">
                <h1 className="flex items-center">
                    <span className="material-symbols-outlined mr-2">{UTIL.icon}</span>
                    {UTIL.name}
                </h1>
                <div className="mt-2 opacity-75">
                    <p>跟随节奏点击按钮即可获知BPM，<b>空格键</b> 也可以代替鼠标点击。</p>
                    <p>3 秒内没有操作或按下重置按钮时，会出现方括号。其代表此次测算已结束，再次点击可以进行新一次的测量。</p>
                    <p>节拍类型的选择只影响节拍的可视化，并不会影响 BPM。如果你不知道一首歌的节拍类型，那么忽略就好了。</p>
                </div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">settings</span>
                    选项
                </h2>
                <div className="mb-3 opacity-75">节拍类型</div>
                <ToggleGroup type="single" className="mb-6 w-full flex-wrap!">
                    {[4, 3, 6, 5, 7, 9, 12].map((val, idx) => (
                        <ToggleGroupItem
                            key={val}
                            value={String(idx + 1)}
                            aria-checked={beatType === val}
                            onClick={() => setBeatType(val)}
                        >
                            {val}/4
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>

                <div className="mb-3 opacity-75">测量精度</div>
                <ToggleGroup type="single" className="mb-2 w-full flex-wrap!">
                    {[
                        { label: "到整数", val: 1 },
                        { label: "到.5", val: 2 },
                        { label: "到.1", val: 3 },
                        { label: "到.01", val: 4 },
                    ].map(({ label, val }) => (
                        <ToggleGroupItem
                            key={val}
                            value={String(val)}
                            aria-checked={accuracy === val}
                            onClick={() => setAccuracy(val)}
                        >
                            {label}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">straighten</span>
                    测量
                </h2>
                <div className="text-center font-bold text-3xl mb-2">
                    {bpm ? (showBrackets ? `[ ${bpm} BPM ]` : `${bpm} BPM`) : "... BPM"}
                </div>
                <div className="text-center opacity-75 whitespace-pre-wrap">
                    {visualBeats || "..."}
                </div>
                <Button className="mt-8 h-50 font-bold text-xl active:dark:bg-neutral-400 active:bg-neutral-950" onClick={click}>
                    CLICK HERE!
                </Button>
                <Button variant={"outline"} className="mr-auto mt-4" onClick={reset}>
                    <span
                        className="material-symbols-outlined"
                    >refresh</span>
                    重置
                </Button>
            </Card>

        </div>
    )
}