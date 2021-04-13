// My logger

const chalk = require('chalk');

const DEBUG_LEVEL = 0;
const INFO_LEVEL = 1;
const WARN_LEVEL = 2;
const ERROR_LEVEL = 3;

const DEFAULT_CONFIG = {
    use_colors: false,
    template: "[{TYPE}] [{TIME:HR}:{TIME:MIN}:{TIME:SEC}.{TIME:MSEC}] {DATA}",
    log_level_names: {
        debug: "DEBUG",
        info: "INFO",
        warn: "WARN",
        error: "ERROR",
        fatal: "FATAL"
    },
    log_level: DEBUG_LEVEL
}

class Logger {

    static ConfigJSON(log_level = 1) {
        return {
            use_colors: false,
            template: `{"type":"{TYPE}","time":{"hr":{TIME:HR},"min":{TIME:MIN},"sec":{TIME:SEC},"msec":{TIME:MSEC}},"data":"{DATA}"}`,
            log_level_names: {
                debug: "DEBUG",
                info: "INFO",
                warn: "WARN",
                error: "ERROR",
                fatal: "FATAL"
            },
            log_level: log_level
        }
    }

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
        const trueConf = {...DEFAULT_CONFIG, ...config};
        this.use_colors = trueConf.use_colors;
        this.log_level = trueConf.log_level;
        this.log_level_names = trueConf.log_level_names;
        this.template = trueConf.template;
    }

    debug(...data) {
        if (this.log_level <= DEBUG_LEVEL) {
            for (let i = 0; i < data.length; i++) {
                console.debug(chalk.gray(Logger.fromTemplate({
                    type: this.log_level_names.debug,
                    data: data[i],
                    date: new Date()
                }, this.template)));
            };
        };
    }

    info(...data) {
        if (this.log_level <= INFO_LEVEL) {
            for (let i = 0; i < data.length; i++) {
                console.info(chalk.white(Logger.fromTemplate({
                    type: this.log_level_names.info,
                    data: data[i],
                    date: new Date()
                }, this.template)));
            };
        };
    }

    log(...data) {
        if (this.log_level <= INFO_LEVEL) {
            for (let i = 0; i < data.length; i++) {
                console.info(chalk.white(Logger.fromTemplate({
                    type: this.log_level_names.info,
                    data: data[i],
                    date: new Date()
                }, this.template)));
            };
        };
    }

    warn(...data) {
        if (this.log_level <= WARN_LEVEL) {
            for (let i = 0; i < data.length; i++) {
                console.warn(chalk.yellow(Logger.fromTemplate({
                    type: this.log_level_names.warn,
                    data: data[i],
                    date: new Date()
                }, this.template)));
            };
        };
    }

    error(...data) {
        if (this.log_level <= ERROR_LEVEL) {
            for (let i = 0; i < data.length; i++) {
                console.error(chalk.redBright(Logger.fromTemplate({
                    type: this.log_level_names.error,
                    data: data[i],
                    date: new Date()
                }, this.template)));
            };
        };
    }

    fatal(...data) {
        if (this.log_level <= ERROR_LEVEL) {
            for (let i = 0; i < data.length; i++) {
                console.error(chalk.bgRed.white(Logger.fromTemplate({
                    type: this.log_level_names.fatal,
                    data: data[i],
                    date: new Date()
                }, this.template)));
            };
        };
    }
};

exports.Logger = Logger;
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
exports.DEBUG_LEVEL = DEBUG_LEVEL;
exports.INFO_LEVEL = INFO_LEVEL;
exports.WARN_LEVEL = WARN_LEVEL;
exports.ERROR_LEVEL = ERROR_LEVEL;