const {logger} = require("./loggers");

function debugMiddleware(req, res, next) {
    logger.debug(`Server Request: ${req.url}`);
    next();
};

module.exports = debugMiddleware;