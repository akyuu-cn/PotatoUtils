import utils from "@/static/utils.json"
import Kana from "@/static/util/ja-kana-quiz/kana.json"

import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import { useEffect, useRef, useState } from "react"
import { Progress } from "@/components/ui/progress"

interface Kana {
    kana: string
    pron: string[]
    type: number // 1=seion 2=dakuon 3=youon
    range: number // 1=hira 2=kata
}

export default function JaKanaQuiz() {
    const ID = "ja-kana-quiz"
    const UTIL = utils.find((u) => u.id === ID)

    const [hiragana, setHiragana] = useState(true)
    const [katakana, setKatakana] = useState(false)

    const [seion, setSeion] = useState(true)
    const [dakuon, setDakuon] = useState(false)
    const [youon, setYouon] = useState(false)

    const [list, setList] = useState<Kana[]>([])
    const [screen, setScreen] = useState<"prepare" | "quiz" | "result">("prepare")

    const [currentIndex, setCurrentIndex] = useState(0)
    const [answer, setAnswer] = useState("")
    const [startTime, setStartTime] = useState<number | null>(null)
    const [results, setResults] = useState<
        { kana: string; pron: string[]; time: number; isCorrect: boolean }[]
    >([])

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const list: Kana[] = genList()
        setList(list)
    }, [hiragana, katakana, seion, dakuon, youon])

    useEffect(() => {
        if (screen === "quiz" && inputRef.current) {
            inputRef.current.focus()
        }
    }, [screen])


    function genList() {
        let array: Kana[] = []
        Kana.forEach((k) => {
            if ((k.range === 1 && hiragana) || (k.range === 2 && katakana)) {
                if (k.type === 1 && seion) array.push(k)
                else if (k.type === 2 && dakuon) array.push(k)
                else if (k.type === 3 && youon) array.push(k)
            }
        })
        return array
    }

    const chartConfig = {
        time: {
            label: "用时",
            color: "#2563eb",
        },
    } satisfies ChartConfig

    if (!UTIL) return null

    return (
        <div className="mx-auto w-full max-w-screen-lg">
            <Card className="card mb-4">
                <h1 className="flex items-center">
                    <span className="material-symbols-outlined mr-2">{UTIL.icon}</span>
                    {UTIL.name}
                </h1>
                <div className="mt-2 opacity-75">
                    日文学习辅助工具。这是一个系统生成假名、用户输入罗马音的小测试，可用于检验对假名的掌握程度。
                </div>
            </Card>

            {screen === "prepare" && (
                <Card className="card mb-4">
                    <h2 className="flex items-center mb-8!">
                        <span className="material-symbols-outlined mr-2">settings</span>
                        选项
                    </h2>

                    <div>
                        <div className="mb-3 opacity-75">假名范围</div>
                        <div className="flex gap-6 mb-4 flex-wrap">
                            <div className="flex gap-2 mb-5">
                                <Switch id="hiragana" checked={hiragana} onCheckedChange={setHiragana} />
                                <Label htmlFor="hiragana">平假名</Label>
                            </div>
                            <div className="flex gap-2 mb-5">
                                <Switch id="katakana" checked={katakana} onCheckedChange={setKatakana} />
                                <Label htmlFor="katakana">片假名</Label>
                            </div>
                        </div>
                        <div className="mb-3 opacity-75">假名类型</div>
                        <div className="flex gap-6 mb-4 flex-wrap">
                            <div className="flex gap-2 mb-5">
                                <Switch id="seion" checked={seion} onCheckedChange={setSeion} />
                                <Label htmlFor="seion">清音</Label>
                            </div>
                            <div className="flex gap-2 mb-5">
                                <Switch id="dakuon" checked={dakuon} onCheckedChange={setDakuon} />
                                <Label htmlFor="dakuon">浊音、半浊音</Label>
                            </div>
                            <div className="flex gap-2 mb-5">
                                <Switch id="youon" checked={youon} onCheckedChange={setYouon} />
                                <Label htmlFor="youon">拗音</Label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="mb-3 opacity-75">范围预览</div>
                        <div className="flex flex-wrap">
                            {list.map((k) => (
                                <div key={k.kana} className="flex items-center justify-center h-11 w-11 border-1">
                                    {k.kana}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        className="mt-8"
                        onClick={() => {
                            if (list.length === 0) return
                            setList(list.sort(() => Math.random() - 0.5))
                            setCurrentIndex(0)
                            setAnswer("")
                            setResults([])
                            setStartTime(Date.now())
                            setScreen("quiz")
                        }}
                    >
                        开始测试
                    </Button>
                </Card>
            )}

            {screen === "quiz" && list[currentIndex] && (
                <Card className="card mb-4">
                    <h2 className="flex items-center mb-8!">
                        <span className="material-symbols-outlined mr-2">assignment</span>
                        测试
                    </h2>

                    <div className="flex mb-4">
                        <div className="h-10 whitespace-nowrap flex items-center justify-center text-4xl">
                            {list[currentIndex].kana}
                        </div>
                        <Input
                            ref={inputRef}
                            className="h-10 ml-4"
                            placeholder="按 Enter 键提交"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && startTime !== null) {
                                    const kanaItem = list[currentIndex]
                                    const trimmed = answer.trim().toLowerCase()
                                    const isCorrect = kanaItem.pron.includes(trimmed)
                                    const time = Date.now() - startTime

                                    if (isCorrect) {
                                        setResults((prev) => [
                                            ...prev,
                                            { kana: kanaItem.kana, pron: kanaItem.pron, time, isCorrect: true },
                                        ])
                                        if (currentIndex + 1 < list.length) {
                                            setCurrentIndex(currentIndex + 1)
                                            setAnswer("")
                                            setStartTime(Date.now())
                                        } else {
                                            setScreen("result")
                                        }
                                    } else {
                                        setResults((prev) => [
                                            ...prev,
                                            { kana: kanaItem.kana, pron: kanaItem.pron, time, isCorrect: false },
                                        ])
                                        setAnswer("")
                                    }
                                }
                            }}

                        />
                    </div>

                    {results.length > 0 && (
                        <div
                            className={`mb-6 ${results[results.length - 1].isCorrect ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {results[results.length - 1].isCorrect
                                ? "回答正确！"
                                : `错误，正确答案是：${list[currentIndex].kana} - ${list[
                                    currentIndex
                                ].pron.join(", ")}，请再试一次`}
                        </div>
                    )}

                    <div className="mb-6">
                        <div className="text-sm mb-1 text-muted-foreground">
                            进度：{currentIndex}/{list.length}
                        </div>
                        <Progress value={(currentIndex / list.length) * 100} className="h-2" />
                    </div>


                    <Button variant="outline" className="w-18" onClick={() => setScreen("prepare")}>
                        返回
                    </Button>
                </Card>
            )}

            {screen === "result" && (
                <Card className="card mb-4">
                    <h2 className="flex items-center mb-8!">
                        <span className="material-symbols-outlined mr-2">bar_chart</span>
                        结果
                    </h2>

                    <div className="opacity-80 leading-loose">
                        {(() => {
                            const total = results.length
                            const correct = results.filter((r) => r.isCorrect).length
                            const totalTimeMs = results.reduce((sum, r) => sum + r.time, 0)
                            const avgTime = totalTimeMs / total
                            return (
                                <>
                                    <div>
                                        你的正确率为 <b>{((correct / total) * 100).toFixed(1)}%</b> ({correct}/{total})
                                    </div>
                                    <div>
                                        总计用时 <b>{(totalTimeMs / 1000).toFixed(3)}</b> 秒，平均每个假名用时{" "}
                                        <b>{(avgTime / 1000).toFixed(3)}</b> 秒
                                    </div>
                                    {results.some(r => !r.isCorrect) && (
                                        <>
                                            <div className="mt-6 opacity-75">答错的假名</div>
                                            {results
                                                .filter(r => !r.isCorrect)
                                                .map((r, i) => (
                                                    <div key={i}>
                                                        <span className="">{r.kana} - {r.pron.join(", ")}</span>
                                                    </div>
                                                ))}
                                        </>
                                    )}
                                </>
                            )
                        })()}
                    </div>

                    <ChartContainer config={chartConfig} className="mt-10 min-h-[200px] w-full">
                        <BarChart data={results}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="kana" />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}ms`}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        hideIndicator={true}

                                    />
                                }
                            />
                            <Bar dataKey="time" radius={4}>
                                {results.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.isCorrect ? "#2563eb" : "#ff4646"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>

                    <Button className="mt-4" onClick={() => setScreen("prepare")}>
                        再来一次
                    </Button>
                </Card>
            )}
        </div>
    )
}

