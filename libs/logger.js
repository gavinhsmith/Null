const chalk = require('chalk');

class Logger {

    static DEFAULT_CONFIG = {
        use_colors: false,
        template: "[{TYPE}] [{TIME:HR}:{TIME:MIN}:{TIME:SEC}:{TIME:MSEC}] {DATA}",
        log_level: 1
    }

    static DEBUG_LEVEL = 0;
    static INFO_LEVEL = 1;
    static WARN_LEVEL = 2;
    static ERROR_LEVEL = 3;

    static fromTemplate(info, template) {
        return template
            .replace(/{TYPE}/g, info.type)
            .replace(/{DATA}/g, info.data)
            .replace(/{TIME:HR}/g, info.date.getHours())
            .replace(/{TIME:MIN}/g, info.date.getMinutes())
            .replace(/{TIME:SEC}/g, info.date.getSeconds())
            .replace(/{TIME:MSEC}/g, info.date.getMilliseconds())
    }

    constructor(config = {}) {
        let trueConf = {...Logger.DEFAULT_CONFIG, ...config};
        this.use_colors = trueConf.colors;
        this.log_level = trueConf.log_level;
        this.template = trueConf.template;
    }

    debug(...data) {
        if (this.log_level <= Logger.DEBUG_LEVEL) {
            for (let i = 0; i < data.length; i++) {
                console.debug(chalk.gray(Logger.fromTemplate({
                    type: "DEBUG",
                    data: data[i],
                    date: new Date()
                }, this.template)));
            };
        };
    }

    info(...data) {
        if (this.log_level <= Logger.INFO_LEVEL) {
            for (let i = 0; i < data.length; i++) {
                console.info(chalk.white(Logger.fromTemplate({
                    type: "INFO",
                    data: data[i],
                    date: new Date()
                }, this.template)));
            };
        };
    }

    log(...data) {
        if (this.log_level <= Logger.INFO_LEVEL) {
            for (let i = 0; i < data.length; i++) {
                console.info(chalk.white(Logger.fromTemplate({
                    type: "INFO",
                    data: data[i],
                    date: new Date()
                }, this.template)));
            };
        };
    }

    warn(...data) {
        if (this.log_level <= Logger.WARN_LEVEL) {
            for (let i = 0; i < data.length; i++) {
                console.warn(chalk.yellow(Logger.fromTemplate({
                    type: "WARN",
                    data: data[i],
                    date: new Date()
                }, this.template)));
            };
        };
    }

    error(...data) {
        if (this.log_level <= Logger.ERROR_LEVEL) {
            for (let i = 0; i < data.length; i++) {
                console.error(chalk.redBright(Logger.fromTemplate({
                    type: "ERROR",
                    data: data[i],
                    date: new Date()
                }, this.template)));
            };
        };
    }

    fatal(...data) {
        if (this.log_level <= Logger.ERROR_LEVEL) {
            for (let i = 0; i < data.length; i++) {
                console.error(chalk.bgRed.white(Logger.fromTemplate({
                    type: "FATAL",
                    data: data[i],
                    date: new Date()
                }, this.template)));
            };
        };
    }
};

module.exports = Logger;