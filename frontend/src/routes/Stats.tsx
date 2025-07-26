import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { showLaunchpad } from "@/components/LaunchpadController"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { useUtilsStats } from "@/hooks/useUtilsStats"

export default function Stats() {

    const chartData = useUtilsStats()

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

    return (
        <div className="mx-auto w-full max-w-screen-lg">
            <Card className="card mb-4">
                <h1 className="flex items-center">
                    <span className="material-symbols-outlined mr-2">chart_data</span>
                    统计
                </h1>
                <div className="mt-2 opacity-75">
                    浏览 PotatoUtils 的统计数据。[WIP]
                </div>
            </Card>
            <Card className="card">
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
        </div>
    )
}
