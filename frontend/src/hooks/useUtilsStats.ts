import { useEffect, useState } from 'react'
import utils from '@/static/utils.json'

export interface ChartEntry {
    id: string
    display: string
    visitors: number
    fill: string
}

export function useUtilsStats() {
    const [chartData, setChartData] = useState<ChartEntry[]>([])

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/stats')
            const stats: Record<string, number> = await res.json()

            const validIds = utils.map(u => u.id)
            const colorList = [
                '#2563eb',
            ]

            const filtered = Object.entries(stats)
                .filter(([path]) => {
                    const match = path.match(/^\/util\/([^/]+)$/)
                    return match && validIds.includes(match[1])
                })
                .map(([path, visitors], index) => {
                    const id = path.split('/').pop()!
                    const color = colorList[index % colorList.length]
                    return {
                        id: id, // chart 结构中的 browser 实际就是 id
                        display: utils.find(u => u.id === id)?.name || "",
                        visitors,
                        fill: color,
                    }
                })

            setChartData(filtered)
        }

        fetchData().catch(console.error)
    }, [])

    return chartData
}