import fs from 'fs'
import path from 'path'

const utils = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../src/static/utils.json'), 'utf-8')
)

const baseUrl = 'https://utils.akyuu.cn'

const staticRoutes = ['/', '/dashboard', '/stats']

const urls = [
    ...staticRoutes,
    ...utils.map((item: { id: string }) => `/util/${item.id}`),
]

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
        .map(
            (url) => `  <url>
    <loc>${baseUrl}${url}</loc>
  </url>`
        )
        .join('\n')}
</urlset>`

fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemapXml)
console.log('✅ sitemap.xml 生成成功')
