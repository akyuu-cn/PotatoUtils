import ejs from 'ejs';
import express from 'express';

const app = express();

const port = 80
const sitename = "Potato Utils" //显示在网页标题上（ToolName | XXX）

app.listen(port,()=>{
  console.log(`PoatoUtils Server started on port ${port} `)
})

app.get('/utils/:name', (req, res) => {
    ejs.renderFile(`utils/${req.params.name}/index.ejs`,{"sitename":sitename}).then(value => {
        res.send(value);
    })
});