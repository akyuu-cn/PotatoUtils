import ejs from 'ejs';
import express from 'express';

const app = express();

const port = 80

app.listen(port,()=>{
  console.log(`PoatoUtils Server started on port ${port} `)
})

app.get('/utils/:name', (req, res) => {
    ejs.renderFile(`utils/${req.params.name}/index.ejs`).then(value => {
        res.send(value);
    })
});