import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { showLaunchpad } from "@/components/LaunchpadController"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { useUtilsStats } from "@/hooks/useUtilsStats"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import tags from "../static/tags.json"
import utils from "../static/utils.json"
import { Toggle } from "@/components/ui/toggle"

export default function Stats() {

    const chartData = useUtilsStats()
    const navigate = useNavigate()

    console.log(chartData)

    const chartConfig = {
        visitors: {
            label: "访问量",
        },
        id: {
            label: "ID",
        },
        display: {
            label: "名称",
        }
    } satisfies ChartConfig

    const [trending, setTrending] = useState<typeof utils>([])
    useEffect(() => {
        let result: typeof utils = []
        chartData.slice(0, 6).map((item) => {
            result.push(utils.find((util) => util.id === item.id)!)
        })
        setTrending(result)
    }, [chartData])

    return (
        <div className="mx-auto w-full max-w-screen-lg">
            <Card className="card mb-4">
                <h1 className="flex items-center">
                    <span className="material-symbols-outlined mr-2">chart_data</span>
                    统计
                </h1>
                <div className="mt-2 opacity-75">
                    浏览 PotatoUtils 的统计数据。
                </div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-4!">
                    <span className="material-symbols-outlined mr-2">bar_chart_4_bars</span>
                    访问量统计
                </h2>

                <ChartContainer className="m-4" config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <YAxis
                            dataKey="display"
                            type="category"
                            tickLine={false}
                            tickMargin={0}
                            axisLine={false}
                            width={100}
                            tick={({ x, y, payload }) => (
                                <text
                                    x={x}
                                    y={y}
                                    dy={5}
                                    textAnchor="end"
                                    style={{
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {payload.value}
                                </text>
                            )}
                        />
                        <XAxis dataKey="visitors" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="visitors" layout="vertical" radius={5} />
                    </BarChart>
                </ChartContainer>
            </Card>

            <Card className="card">
                <h2 className="flex items-center mb-4!">
                    <span className="material-symbols-outlined mr-2">trending_up</span>
                    最热门的实用工具
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trending.map((util) => (
                        <Card
                            key={util.id}
                            className="p-7 card-clickable relative overflow-hidden button-card-bg-icon-rotate-parent"
                            onClick={() => { navigate(`/util/${util.id}`) }}
                        >
                            <h1 className="flex items-center">
                                <span className="material-symbols-outlined mr-2">{util.icon}</span>
                                {util.name}
                            </h1>
                            <div className="opacity-75 mb-6">{util.description}</div>
                            <div className="launchpad-tool-card-tags mt-auto flex gap-2">
                                {util.tags.map(tagId => {
                                    const tag = tags.find(t => t.id === tagId)
                                    return tag ? (
                                        <Toggle key={tag.id} aria-label={tag.name}>
                                            <span className="material-symbols-outlined">{tag.icon}</span>
                                            {tag.name}
                                        </Toggle>
                                    ) : null
                                })}
                            </div>
                            <div className="absolute bottom-0 right-0 -mb-8 -mr-6">
                                <span className="material-symbols-outlined button-card-bg-icon-rotate text-[128px] opacity-10">
                                    {util.icon}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    )
}
