import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import path from 'path'
import { fileURLToPath } from 'url'
import { getStats, incrementPath, loadStats, saveStats, backupStats } from './stats.js'
import type { VisitPayload } from './types.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = Fastify()
const staticPath = path.join(__dirname, '../../frontend/dist')

app.register(fastifyStatic, {
  root: staticPath,
  prefix: '/',
})

app.setNotFoundHandler((request, reply) => {
  if (request.raw.url?.startsWith('/api')) {
    reply.status(404).send({ error: 'API Not Found' })
  } else {
    return reply.sendFile('index.html')
  }
})

app.get('/api/stats', async (req, reply) => {
  return getStats()
})

app.post('/api/visit', async (req, reply) => {
  const payload = req.body as VisitPayload
  const ip = req.ip
  if (!payload.path || typeof payload.path !== 'string') {
    return reply.code(400).send({ error: 'Invalid payload' })
  }
  const ok = incrementPath(payload.path, ip)
  if (!ok) {
    return reply.code(429).send({ error: 'Too Many Requests' })
  }
  return { success: true }
})

const start = async () => {
  await loadStats()
  await app.listen({ port: 3001, host: '0.0.0.0' })
  console.log('[Server] Server running at http://localhost:3001')
}

start()

// 自动定期保存
setInterval(() => {
  saveStats()
}, SAVE_INTERVAL)

// 每日定时备份（使用 cron）
import cron from 'node-cron'
import { SAVE_INTERVAL } from './config.js'
cron.schedule('0 0 * * *', () => {
  backupStats()
})

// 捕获退出保存
process.on('SIGINT', async () => {
  console.log('[Shutdown] Saving stats before exit...')
  await saveStats()
  process.exit()
})

process.on('SIGTERM', async () => {
  console.log('[Shutdown] Saving stats before exit...')
  await saveStats()
  process.exit()
})
