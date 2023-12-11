"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.info = exports.debug = exports.init = void 0;
function getTimeString() {
    let str = "";
    let date = new Date();
    if (date.getHours() < 10) {
        str += "0";
    }
    str += date.getHours().toString();
    str += ":";
    if (date.getMinutes() < 10) {
        str += "0";
    }
    str += date.getMinutes().toString();
    str += ":";
    if (date.getSeconds() < 10) {
        str += "0";
    }
    str += date.getSeconds().toString();
    return str;
}
var debugtf;
function init(config) {
    debugtf = config.debuglog; // 是否输出调试日志
}
exports.init = init;
function debug(t, p) {
    if (debugtf) {
        console.log(`[${getTimeString()}] [${p}/DEBUG]: ${t}`);
    }
}
exports.debug = debug;
function info(t, p) {
    console.log(`[${getTimeString()}] [${p}/INFO]: ${t}`);
}
exports.info = info;
function warn(t, p) {
    console.log(`[${getTimeString()}] [${p}/WARN]: ${t}`);
}
exports.warn = warn;
function error(t, p) {
    if (t instanceof Error) {
        console.log(`[${getTimeString()}] [${p}/ERROR]:`);
        console.log(t);
    }
    else {
        console.log(`[${getTimeString()}] [${p}/ERROR]: ${t}`);
    }
}
exports.error = error;
