"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.view = exports.init = void 0;
const fs = require("fs");
const logger = require("./logger");
var statsJson;
function init(config) {
    statsJson = JSON.parse(fs.readFileSync("data/stats/stats.json").toString());
    setInterval(function () {
        logger.info("Saving stats data...", "stats");
        fs.writeFileSync("data/stats/stats.json", JSON.stringify(statsJson));
        logger.info("Stats data saved!", "stats");
    }, 15 * 60 * 1000);
    logger.debug(JSON.stringify(statsJson), "stats");
}
exports.init = init;
function view(type, id) {
    let item = statsJson.find((item) => {
        return item.type == type && item.id == id;
    });
    if (item != null) {
        item.valueView += 1;
    }
    else {
        statsJson.push({
            "type": type,
            "id": id,
            "valueView": 1
        });
    }
    logger.debug(`${type} ${id} view 增加了 1`, "stats");
}
exports.view = view;
