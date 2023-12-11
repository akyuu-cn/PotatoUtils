"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ejs = require("ejs");
const express = require("express");
const fs = require("fs");
const logger = require("./logger");
const stats = require("./stats");
const app = express();
// 配置文件读取
const config = JSON.parse(fs.readFileSync('config.json').toString());
const port = config.port; // 运行端口
const sitename = config.sitename; // 显示在网页标题上（ToolName | SiteName）
logger.init(config); // 初始化日志模块
stats.init(config); // 初始化统计模块
// utils 页面
app.get('/utils/:name', (req, res) => {
    ejs.renderFile(`utils/${req.params.name}/index.ejs`, { "sitename": sitename })
        .then(value => {
        res.send(value);
        logger.info(`utils:${req.params.name} rendered!`, "ejsRenderer");
        stats.view("utils", `${req.params.name}`);
    }).catch((e) => {
        logger.error(e, "ejsRenderer");
        ejs.renderFile(`pages/error_page.ejs`)
            .then(value => { res.send(value); });
    });
});
// lib 请求处理
app.get('/lib/*', (req, res) => {
    try {
        res.send(fs.readFileSync(`lib/${req.params[0]}`));
        logger.debug(`lib:${req.params[0]} sended!`, "ejsRenderer");
    }
    catch (e) {
        logger.error(e, "libRequest");
        ejs.renderFile(`pages/error_page.ejs`)
            .then(value => { res.send(value); });
    }
});
// js 请求处理
app.get('/js/:name', (req, res) => {
    try {
        res.send(fs.readFileSync(`js/${req.params.name}`));
        logger.debug(`js:${req.params.name} sended!`, "ejsRenderer");
    }
    catch (e) {
        logger.error(e, "jsRequest");
        ejs.renderFile(`pages/error_page.ejs`)
            .then(value => { res.send(value); });
    }
});
// css 请求处理
app.get('/css/:name', (req, res) => {
    try {
        res.send(fs.readFileSync(`css/${req.params.name}`));
        logger.debug(`css:${req.params.name} sended!`, "ejsRenderer");
    }
    catch (e) {
        logger.error(e, "cssRequest");
        ejs.renderFile(`pages/error_page.ejs`)
            .then(value => { res.send(value); });
    }
});
// resources 请求处理
app.get('/resources/:name', (req, res) => {
    try {
        res.send(fs.readFileSync(`resources/${req.params.name}`));
        logger.debug(`resources:${req.params.name} sended!`, "ejsRenderer");
    }
    catch (e) {
        logger.error(e, "resourcesRequest");
        ejs.renderFile(`pages/error_page.ejs`)
            .then(value => { res.send(value); });
    }
});
// data 请求处理
app.get('/data/:utilsName/:name', (req, res) => {
    try {
        res.send(fs.readFileSync(`data/${req.params.utilsName}/${req.params.name}`));
        logger.info(`data:${req.params.utilsName}:${req.params.name} sended!`, "ejsRenderer");
    }
    catch (e) {
        logger.debug(e, "dataRequest");
        ejs.renderFile(`pages/error_page.ejs`)
            .then(value => { res.send(value); });
    }
});
// 主页
app.get('/', (req, res) => {
    try {
        let data = fs.readFileSync('data/index/utils_list.json', "utf-8");
        let jsonData = JSON.parse(data);
        ejs.renderFile(`pages/index.ejs`, { "data": jsonData })
            .then(value => {
            res.send(value);
            logger.info(`mainpage rendered!`, "ejsRenderer");
        });
        stats.view("page", "index");
    }
    catch (e) {
        logger.error(e, "ejsRenderer");
    }
});
// 统计页面
app.get('/stats/', (req, res) => {
    try {
        let data = fs.readFileSync('data/stats/stats.json', "utf-8");
        let jsonData = JSON.parse(data);
        ejs.renderFile(`pages/stats.ejs`, { "data": jsonData })
            .then(value => {
            res.send(value);
            logger.info(`statspage rendered!`, "ejsRenderer");
        });
        stats.view("page", "stats");
    }
    catch (e) {
        logger.error(e, "ejsRenderer");
    }
});
// 启动端口监听
try {
    app.listen(port, () => {
        logger.info(`PoatoUtils Server started on port ${port} `, "express");
    });
}
catch (e) {
    logger.error(e, "express");
}
