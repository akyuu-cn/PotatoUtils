import path from "path"

export const STATS_FILE = path.resolve('stats.json')
export const BACKUP_DIR = path.resolve('backups')
export const BACKUP_KEEP_COUNT = 30
export const SAVE_INTERVAL = 5 * 60 * 1000 // 5 分钟自动保存一次
export const IP_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 分钟窗口
export const IP_LIMIT_COUNT = 100 // 每 IP 每窗口最多访问 100 次
