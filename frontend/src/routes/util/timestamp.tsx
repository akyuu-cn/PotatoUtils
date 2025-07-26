import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function Timestamp() {
    const ID = "timestamp"
    const UTIL = utils.find(u => u.id === ID)

    const [timestamp, setTimestamp] = useState("")
    const [copyIconTimestamp, setCopyIconTimestamp] = useState("content_copy")

    const [mode, setMode] = useState<"encode" | "decode">("encode")
    const [encodeMode, setEncodeMode] = useState<"seconds" | "milliseconds">("seconds")

    const [timeFormat1, setTimeFormat1] = useState("")
    const [timeFormat2, setTimeFormat2] = useState("")
    const [timeFormat3, setTimeFormat3] = useState("")

    const [copyIconTimeFormat1, setCopyIconTimeFormat1] = useState("content_copy")
    const [copyIconTimeFormat2, setCopyIconTimeFormat2] = useState("content_copy")
    const [copyIconTimeFormat3, setCopyIconTimeFormat3] = useState("content_copy")

    const [date, setDate] = useState<Date>(new Date())
    const [open, setOpen] = useState(false)

    const [time, setTime] = useState(formatDate(new Date(), "HH:mm:ss"))
    const [selectedOffset, setSelectedOffset] = useState(getLocalTimezoneOffset)

    useEffect(() => {
        const tz = parseInt(selectedOffset) || 0
        const offset = tz - Number(getLocalTimezoneOffset())

        if (mode !== "encode") { return }

        if (!date || !time) {
            setTimestamp("")
            return
        }

        // 构造带时区偏移的本地时间
        const [h, m, s] = time.split(":").map(Number)
        const localDate = new Date(date)
        localDate.setHours(h - offset)
        localDate.setMinutes(m)
        localDate.setSeconds(s)

        // 转换为 UTC
        const ts = encodeMode === "seconds" ? Math.floor(localDate.getTime() / 1000) : localDate.getTime()
        setTimestamp(ts.toString())

        setTimeFormat1(relativeTime(localDate))
        setTimeFormat2(formatDate(localDate, "yyyy-MM-dd HH:mm:ss"))
        setTimeFormat3(localDate.toISOString())

        const timer = setInterval(() => {
            setTimeFormat1(relativeTime(localDate))
        }, 1000)

        return () => clearInterval(timer)

    }, [date, time, encodeMode, mode, selectedOffset])

    useEffect(() => {
        const tz = parseInt(selectedOffset) || 0
        const offset = tz - Number(getLocalTimezoneOffset())

        if (mode !== "decode") { return }

        const num = Number(timestamp)
        if (isNaN(num) || timestamp.length !== 13 && timestamp.length !== 10) {
            setTimeFormat1("时间戳格式不合法")
            setTimeFormat2("时间戳格式不合法")
            setTimeFormat3("时间戳格式不合法")
            return
        }

        const ts = timestamp.length === 13 ? num : num * 1000
        const d = new Date(ts)
        const dWithOffset = new Date(ts + offset * 60 * 60 * 1000)

        // 输出各种格式
        setTimeFormat1(relativeTime(d))
        setTimeFormat2(formatDate(d, "yyyy-MM-dd HH:mm:ss"))
        setTimeFormat3(d.toISOString())


        setTime(formatDate(dWithOffset, "HH:mm:ss"))
        setDate(dWithOffset)

        const timer = setInterval(() => {
            setTimeFormat1(relativeTime(d))
        }, 1000)

        return () => clearInterval(timer)

    }, [timestamp, mode, selectedOffset])


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


                <div className="flex gap-4">
                    <TimezoneSelect
                        onChange={(value) => setSelectedOffset(value)}
                        value={selectedOffset}
                    />
                    <div className={cn(mode === "decode" ? "opacity-75" : "", "flex flex-col gap-3 flex-1")}>
                        <Popover open={mode === "encode" ? open : false} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date-picker"
                                    className="justify-between font-normal"
                                >
                                    {date ? date.toLocaleDateString() : "选择日期"}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        if (date) {
                                            setDate(date)
                                        }
                                        setOpen(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                        <Input
                            disabled={mode === "decode"}
                            type="time"
                            id="time-picker"
                            step="1"
                            value={time}
                            onChange={(e) => {
                                setTime(e.target.value)
                            }}
                            className={cn(mode === "decode" ? "opacity-75" : "", "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none")}
                        />
                    </div>
                </div>



                <div className="mt-10 mb-10 flex justify-center gap-8">
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
                    className={cn(mode == "encode" ? "opacity-75" : "", "min-h-0")}
                    placeholder={Math.floor(Date.now() / 1000).toString()}
                    value={timestamp}
                    onChange={(e) => {
                        setTimestamp(e.target.value)
                    }} />
                <Button variant="ghost" className="ml-auto mt-2 opacity-90 material-symbols-animated-parent" onClick={() => {
                    navigator.clipboard.writeText(timestamp)
                    setCopyIconTimestamp("check")
                    setTimeout(() => {
                        setCopyIconTimestamp("content_copy")
                    }, 1000)
                }}>
                    <span
                        className="material-symbols-outlined material-symbols-animated"
                    >{copyIconTimestamp}</span>
                    复制内容
                </Button>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">format_image_left</span>
                    时间描述
                </h2>

                <div className="opacity-75 mb-6">
                    相对于你目前所处的时区（UTC{Number(getLocalTimezoneOffset()) > 0 ? "+" : "-"}{Math.abs(Number(getLocalTimezoneOffset()))}），这个时刻可以被描述为：
                </div>

                {/* 10 分钟前 */}
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="outline" size="icon" className="material-symbols-animated-parent" onClick={() => {
                        navigator.clipboard.writeText(timeFormat1)
                        setCopyIconTimeFormat1("check")
                        setTimeout(() => {
                            setCopyIconTimeFormat1("content_copy")
                        }, 1000)
                    }}>
                        <span
                            className="material-symbols-outlined material-symbols-animated"
                        >{copyIconTimeFormat1}</span>
                    </Button>

                    <code className="opacity-90 text-2xl ml-4">{timeFormat1}</code>
                </div>

                {/* 2025-07-24 16:45:30 */}
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="outline" size="icon" className="material-symbols-animated-parent" onClick={() => {
                        navigator.clipboard.writeText(timeFormat2)
                        setCopyIconTimeFormat2("check")
                        setTimeout(() => {
                            setCopyIconTimeFormat2("content_copy")
                        }, 1000)
                    }}>
                        <span
                            className="material-symbols-outlined material-symbols-animated"
                        >{copyIconTimeFormat2}</span>
                    </Button>

                    <code className="opacity-90 text-2xl ml-4">{timeFormat2}</code>
                </div>

                {/* 2025-07-24T08:34:27+00:00 */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="material-symbols-animated-parent" onClick={() => {
                        navigator.clipboard.writeText(timeFormat3)
                        setCopyIconTimeFormat3("check")
                        setTimeout(() => {
                            setCopyIconTimeFormat3("content_copy")
                        }, 1000)
                    }}>
                        <span
                            className="material-symbols-outlined material-symbols-animated"
                        >{copyIconTimeFormat3}</span>
                    </Button>

                    <code className="opacity-90 text-2xl ml-4">{timeFormat3}</code>
                </div>

            </Card>

            <Card className="card">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">settings</span>
                    选项
                </h2>

                <div className="mb-3 opacity-75">
                    编码格式
                </div>
                <ToggleGroup type="single" className="w-full flex-wrap!">
                    <ToggleGroupItem value={"seconds"} aria-checked={encodeMode === "seconds"} onClick={() => { setEncodeMode("seconds") }}>
                        秒（10 位时间戳）
                    </ToggleGroupItem>
                    <ToggleGroupItem value={"milliseconds"} aria-checked={encodeMode === "milliseconds"} onClick={() => { setEncodeMode("milliseconds") }}>
                        毫秒（13 位时间戳）
                    </ToggleGroupItem>
                </ToggleGroup>

            </Card>

        </div>
    )
}

export function TimezoneSelect({
    onChange,
    value,
}: {
    onChange?: (value: string) => void
    value: string
}) {
    // 初始化时读取当前本地时区偏移（单位：小时）
    const [selectedOffset, setSelectedOffset] = useState(getLocalTimezoneOffset)

    const timezoneOffsets = Array.from({ length: 27 }, (_, i) => i - 12) // -12 到 +14
    const formatLabel = (offset: number) => {
        const sign = offset >= 0 ? "+" : "-"
        const abs = Math.abs(offset).toString()
        return `UTC${sign}${abs}`
    }

    const handleChange = (value: string) => {
        setSelectedOffset(value)
        onChange?.(value)
    }

    return (
        <Select value={selectedOffset} onValueChange={handleChange}>
            <SelectTrigger className="flex-1">
                <SelectValue placeholder="选择 UTC 时区" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>UTC 时区</SelectLabel>
                    {timezoneOffsets.map((offset) => {
                        const label = formatLabel(offset)
                        return (
                            <SelectItem key={offset} value={offset.toString()}>
                                {label}
                            </SelectItem>
                        )
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

const getLocalTimezoneOffset = () => {
    const offsetMinutes = new Date().getTimezoneOffset() // e.g. -480 表示 UTC+8
    return (-offsetMinutes / 60).toString() // 返回 "8" 或 "-5"
}

function formatDate(date: Date, format: string) {
    return format
        .replace("yyyy", date.getFullYear().toString())
        .replace("MM", String(date.getMonth() + 1).padStart(2, "0"))
        .replace("dd", String(date.getDate()).padStart(2, "0"))
        .replace("HH", String(date.getHours()).padStart(2, "0"))
        .replace("mm", String(date.getMinutes()).padStart(2, "0"))
        .replace("ss", String(date.getSeconds()).padStart(2, "0"))
}

function relativeTime(date: Date) {
    const now = new Date()
    const diff = date.getTime() - now.getTime() // 目标时间 - 当前时间
    const seconds = Math.round(Math.abs(diff) / 1000)

    const suffix = diff < 0 ? "前" : "后"

    if (seconds === 0) { return "此刻" }

    if (seconds < 60) return `${seconds} 秒${suffix}`
    const minutes = Math.round(seconds / 60)
    if (minutes < 60) return `大约 ${minutes} 分钟${suffix}`
    const hours = Math.round(minutes / 60)
    if (hours < 24) return `大约 ${hours} 小时${suffix}`
    const days = Math.round(hours / 24)
    return `大约 ${days} 天${suffix}`
}
