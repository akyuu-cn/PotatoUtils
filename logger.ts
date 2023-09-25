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

export function debug(t: any, p: String, tf: Boolean) {
    if (tf) {
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

