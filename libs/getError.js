const fs = require("fs");
const path = require("path");

//getError

    function getError(code) {
        let errors = require(path.join(directory, "users.json"));
        if (errors[String(code)] == null) {
            return {
                err_code: "Unknown",
                err_message: String(errors["default"].name),
                err_message_long: String(errors["default"].desc)
            }
        } else {
            return {
                err_code: String(code),
                err_message: String(errors[String(code)].name),
                err_message_long: String(errors[String(code)].desc)
            }
        };
    };

module.exports = getError;