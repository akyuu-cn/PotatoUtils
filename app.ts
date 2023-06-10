import ejs from 'ejs'
import express from 'express'
import fs from 'fs'

const app = express()


const port = 80 // 运行端口
const sitename = "Potato Utils" // 显示在网页标题上（ToolName | SiteName）
let config = fs.readFileSync('config.yml')

app.listen(port, () => {
  console.log(`PoatoUtils Server started on port ${port} `)
})

// utils 页面
app.get('/utils/:name', (req, res) => {
  ejs.renderFile(`utils/${req.params.name}/index.ejs`, { "sitename": sitename })
  .then(value => {res.send(value)})
})

// js 请求处理
app.get('/js/:name', (req, res) => {
  res.send(fs.readFileSync(`js/${req.params.name}`))
})

// css 请求处理
app.get('/css/:name', (req, res) => {
  res.send(fs.readFileSync(`css/${req.params.name}`))
})

// resources 请求处理
app.get('/resources/:name', (req, res) => {
  res.send(fs.readFileSync(`resources/${req.params.name}`))
})


// data 请求处理
app.get('/data/:utilsName/:name', (req, res) => {
  res.send(fs.readFileSync(`data/${req.params.utilsName}/${req.params.name}`))
})

// 主页
app.get('/', (req, res) => {
  let data = fs.readFileSync('data/index/utils_list.json', "utf-8")
  let jsonData = JSON.parse(data)

  ejs.renderFile(`pages/index.ejs`, { "data": jsonData })
  .then(value => {res.send(value)})
})

