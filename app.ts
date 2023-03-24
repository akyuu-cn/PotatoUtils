import ejs from 'ejs'
import express from 'express'
import fetch from 'node-fetch'

const app = express();


const url = "http://localhost" // 主体链接
const port = 80 // 运行端口
const sitename = "Potato Utils" // 显示在网页标题上（ToolName | SiteName）

app.listen(port, () => {
  console.log(`PoatoUtils Server started on port ${port} `)
})

// utils 页面
app.get('/utils/:name', (req, res) => {
  ejs.renderFile(`utils/${req.params.name}/index.ejs`, { "sitename": sitename }).then(value => {
    res.send(value)
  })
})

// js 请求处理
app.get('/js/:name', (req, res) => {
  ejs.renderFile(`js/${req.params.name}`).then(value => {
    res.send(value)
  })
})

// data 请求处理
app.get('/data/:name/:dname', (req, res) => {
  ejs.renderFile(`data/${req.params.name}/${req.params.dname}`).then(value => {
    res.send(value)
  })
})

// 主页
app.get('/', (req, res) => {
fetch(`${url}/data/index/utils_list.json`).then(async (data) => {
  let jsonData = await data.json()
  ejs.renderFile(`pages/index.ejs`, {"data":jsonData}).then(value => {
    res.send(value)
  })
})

})

