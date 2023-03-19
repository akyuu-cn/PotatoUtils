import ejs from 'ejs'
import express from 'express'
import fetch from 'node-fetch'

const app = express();




const port = 80
const sitename = "Potato Utils" //显示在网页标题上（ToolName | SiteName）

app.listen(port, () => {
  console.log(`PoatoUtils Server started on port ${port} `)
})

app.get('/utils/:name', (req, res) => {
  ejs.renderFile(`utils/${req.params.name}/index.ejs`, { "sitename": sitename }).then(value => {
    res.send(value)
  })
})

app.get('/js/:name', (req, res) => {
  ejs.renderFile(`js/${req.params.name}`).then(value => {
    res.send(value)
  })
})

app.get('/data/:name/:dname', (req, res) => {
  ejs.renderFile(`data/${req.params.name}/${req.params.dname}`).then(value => {
    res.send(value)
  })
})


