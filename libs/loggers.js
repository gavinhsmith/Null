const {Logger, DEBUG_LEVEL} = require("./Logger")

const logger = new Logger({
    use_colors: true,
    log_level: DEBUG_LEVEL
});

exports.logger = logger;