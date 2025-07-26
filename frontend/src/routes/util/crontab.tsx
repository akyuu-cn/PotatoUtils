import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

import parser from "cron-parser"
import { Helmet } from "react-helmet-async"


export default function Crontab() {
    const ID = "crontab"
    const UTIL = utils.find(u => u.id === ID)

    const [crontabInput1, setCrontabInput1] = useState("0")
    const [crontabInput2, setCrontabInput2] = useState("0")
    const [crontabInput3, setCrontabInput3] = useState("*")
    const [crontabInput4, setCrontabInput4] = useState("*")
    const [crontabInput5, setCrontabInput5] = useState("*")

    const [crontabDesc, setCrontabDesc] = useState("...")

    const [copyIconOutput, setCopyIconOutput] = useState("content_copy")

    useEffect(() => {
        setCrontabDesc(cronToDesc(`${crontabInput1} ${crontabInput2} ${crontabInput3} ${crontabInput4} ${crontabInput5}`))
    }, [crontabInput1, crontabInput2, crontabInput3, crontabInput4, crontabInput5])

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
                    <span className="material-symbols-outlined mr-2">edit_calendar</span>
                    表达式
                </h2>
                <div className="text-center text-3xl mb-6">
                    {crontabDesc}
                </div>
                <div className="text-center text-md mb-6 text-lg opacity-75 font-mono">
                    {crontabInput1} {crontabInput2} {crontabInput3} {crontabInput4} {crontabInput5}
                </div>
                <div className="flex gap-4 justify-center items-center text-center">
                    <div>
                        <Input
                            value={crontabInput1}
                            onChange={(e) => setCrontabInput1(e.target.value)}
                        ></Input>
                        <div className="mt-2 opacity-50">分</div>
                    </div>
                    <div>
                        <Input
                            value={crontabInput2}
                            onChange={(e) => setCrontabInput2(e.target.value)}
                        ></Input>
                        <div className="mt-2 opacity-50">时</div>
                    </div>
                    <div>
                        <Input
                            value={crontabInput3}
                            onChange={(e) => setCrontabInput3(e.target.value)}
                        ></Input>
                        <div className="mt-2 opacity-50">日</div>
                    </div>
                    <div>
                        <Input
                            value={crontabInput4}
                            onChange={(e) => setCrontabInput4(e.target.value)}
                        ></Input>
                        <div className="mt-2 opacity-50">月</div>
                    </div>
                    <div>
                        <Input
                            value={crontabInput5}
                            onChange={(e) => setCrontabInput5(e.target.value)}
                        ></Input>
                        <div className="mt-2 opacity-50">星期</div>
                    </div>
                </div>
                <Button variant="ghost" className="ml-auto mt-4 opacity-90 material-symbols-animated-parent" onClick={() => {
                    navigator.clipboard.writeText(`${crontabInput1} ${crontabInput2} ${crontabInput3} ${crontabInput4} ${crontabInput5}`)
                    setCopyIconOutput("check")
                    setTimeout(() => setCopyIconOutput("content_copy"), 1000)
                }}>
                    <span className="material-symbols-outlined material-symbols-animated">{copyIconOutput}</span>
                    复制表达式
                </Button>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">hourglass_empty</span>
                    未来计划执行时间
                </h2>
                <div>
                    {getNextExecutions(
                        `${crontabInput1} ${crontabInput2} ${crontabInput3} ${crontabInput4} ${crontabInput5}`,
                        5
                    ).map((date, index) => (
                        <div key={index} className="mb-2 opacity-75 font-mono">
                            {date}
                        </div>
                    ))}
                </div>
            </Card>


        </div>
    )
}

function cronToDesc(expression: string): string {

    try {
        parser.parse(expression)
    } catch (err) {
        return "无效的 Cron 表达式"
    }

    const cronParts = expression.trim().split(/\s+/)

    const [min, hour, day, month, week] = cronParts

    // 中文名称映射
    const weekMap: Record<string, string> = {
        "0": "周日", "1": "周一", "2": "周二", "3": "周三",
        "4": "周四", "5": "周五", "6": "周六", "7": "周日"
    }

    const monthMap: Record<string, string> = {
        "1": "一月", "2": "二月", "3": "三月", "4": "四月",
        "5": "五月", "6": "六月", "7": "七月", "8": "八月",
        "9": "九月", "10": "十月", "11": "十一月", "12": "十二月"
    }

    function parseField(field: string, name: string, map?: Record<string, string>) {
        if (field === "*") return `每个 ${name}`
        if (field.includes(",")) {
            return field.split(",").map(v => map?.[v] || v + name).join("、")
        }
        if (field.includes("-")) {
            const [start, end] = field.split("-")
            if (map) return `${map[start] || start}${name} 到 ${map[end] || end}${name}`
            return `${start}${name} 到 ${end}${name}`
        }
        return map?.[field] || `${field}${name}`
    }

    const dayText = parseField(day, " 日")
    const monthText = parseField(month, "", monthMap)
    const weekText = week === "*" ? "" : parseField(week, "", weekMap)

    // 拼装描述
    let timeText = ""
    if (hour === "*" && min === "*") {
        timeText = "每分钟"
    } else if (hour !== "*" && min === "*") {
        timeText = `${hour} 点的每分钟`
    } else if (hour === "*" && min !== "*") {
        timeText = `每小时的 ${min} 分`
    } else {
        timeText = `${hour} 点 ${min} 分`
    }

    let dateText = ""

    if (day !== "*" && week !== "*") {
        dateText = `${dayText} 或 ${weekText}`
    } else if (day !== "*") {
        dateText = dayText
    } else if (week !== "*") {
        dateText = weekText
    } else {
        dateText = "每天"
    }

    let monthPrefix = (month !== "*") ? `${monthText} 的` : ""
    return `${monthPrefix} ${dateText} 的 ${timeText} 执行`
}


export function getNextExecutions(
    cronExpr: string,
    count: number,
    from: Date = new Date()
): string[] {
    try {
        const options = {
            currentDate: from,
            iterator: true,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone, // 使用当前时区
        }

        const interval = parser.parse(cronExpr, options)
        const results: string[] = []

        for (let i = 0; i < count; i++) {
            const obj = interval.next()
            results.push(new Date(obj.toString()).toLocaleString())
        }

        return results
    } catch (err) {
        return ["无效的 Cron 表达式"]
    }
}