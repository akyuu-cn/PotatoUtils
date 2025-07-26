import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'
import { IP_LIMIT_WINDOW_MS, IP_LIMIT_COUNT, STATS_FILE, BACKUP_DIR, BACKUP_KEEP_COUNT } from './config.js'



type StatsData = Record<string, number>
let stats: StatsData = {}
const ipAccessMap: Map<string, number[]> = new Map()

export function incrementPath(pathname: string, ip: string) {
    const now = Date.now()
    const list = ipAccessMap.get(ip) || []

    // 清除旧时间戳
    const recent = list.filter(t => now - t < IP_LIMIT_WINDOW_MS)

    // 更新 Map 或移除
    if (recent.length === 0) {
        ipAccessMap.delete(ip)
    } else {
        ipAccessMap.set(ip, recent)
    }

    // 是否超出限制
    if (recent.length >= IP_LIMIT_COUNT) return false

    // 添加新时间戳并写回
    recent.push(now)
    ipAccessMap.set(ip, recent)
 
    stats[pathname] = (stats[pathname] || 0) + 1
    console.log(`[DEBUG] Incremented ${pathname} for IP ${ip}`)
    return true
}


export function getStats(): StatsData {
    return stats
}

export async function loadStats() {
    try {
        const data = await fs.promises.readFile(STATS_FILE, 'utf-8')
        stats = JSON.parse(data)
        console.log(`[Stats] Loaded stats from ${STATS_FILE}`)
    } catch {
        stats = {}
        console.log('[Stats] No existing stats file, starting fresh')
    }
}

export async function saveStats() {
    try {
        await fs.promises.writeFile(STATS_FILE, JSON.stringify(stats, null, 2))
        console.log(`[Stats] Saved to ${STATS_FILE}`)
    } catch (err) {
        console.error('[Stats] Save error:', err)
    }
}

export async function backupStats() {
    try {
        const date = dayjs().format('YYYYMMDDHHmmss')
        const file = path.join(BACKUP_DIR, `stats-${date}.json`)
        if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR)
        await fs.promises.writeFile(file, JSON.stringify(stats, null, 2))
        console.log(`[Stats] Backup created at ${file}`)
        await cleanupOldBackups()
    } catch (err) {
        console.error('[Stats] Backup failed:', err)
    }
}

async function cleanupOldBackups() {
    const files = await fs.promises.readdir(BACKUP_DIR)
    const statFiles = files
        .filter(f => f.startsWith('stats-') && f.endsWith('.json'))
        .sort((a, b) => b.localeCompare(a)) // 最新的在前
    const toDelete = statFiles.slice(BACKUP_KEEP_COUNT)
    await Promise.all(toDelete.map(f => fs.promises.unlink(path.join(BACKUP_DIR, f))))
}
