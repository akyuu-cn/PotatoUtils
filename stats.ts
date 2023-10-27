import fs from 'fs'
import * as logger from './logger'

var statsJson: any

export function init() {
    statsJson = JSON.parse(fs.readFileSync("data/stats/stats.json").toString())
    setInterval(function () {
        logger.info("Saving stats data...", "stats")
        fs.writeFileSync("data/stats/stats.json", JSON.stringify(statsJson))
        logger.info("Stats data saved!", "stats")
    }, 60 * 1000)
    logger.debug(JSON.stringify(statsJson), "stats")
}

export function view(type: String, id: String) {
    let item = statsJson.find((item: any) => {
        return item.type == type && item.id == id
    })
    if (item != null) {
        item.valueView += 1
    } else {
        statsJson.push({
            "type": type,
            "id": id,
            "valueView": 1
        })
    }
    logger.debug(`${type} ${id} view 增加了 1`, "stats")
}