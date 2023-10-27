import fs from 'fs'

function getTimeString() {
    let str: String = ""
    let date = new Date()

    if (date.getHours() < 10) {
        str += "0"
        str += date.getHours().toString()
    } else {
        str += date.getHours().toString()
    }

    str += ":"

    if (date.getMinutes() < 10) {
        str += "0"
        str += date.getMinutes().toString()
    } else {
        str += date.getMinutes().toString()
    }

    str += ":"

    if (date.getSeconds() < 10) {
        str += "0"
        str += date.getSeconds().toString()
    } else {
        str += date.getSeconds().toString()
    }

    return str
}

var debugtf: Boolean

export function init(){
    const config = JSON.parse(fs.readFileSync('config.json').toString())
    debugtf = config.debuglog // 是否输出调试日志
}

export function debug(t: any, p: String) {
    if (debugtf) {
        console.log(`[${getTimeString()}] [${p}/DEBUG]: ${t}`)
    }
}
export function info(t: any, p: String) {
    console.log(`[${getTimeString()}] [${p}/INFO]: ${t}`)
}
export function warn(t: any, p: String) {
    console.log(`[${getTimeString()}] [${p}/WARN]: ${t}`)
}
export function error(t: any, p: String) {
    if (t instanceof Error) {
        console.log(`[${getTimeString()}] [${p}/ERROR]:`)
        console.log(t)
    } else {
        console.log(`[${getTimeString()}] [${p}/ERROR]: ${t}`)
    }


}

