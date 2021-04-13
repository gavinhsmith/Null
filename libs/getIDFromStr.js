// Create a id string from a string

const crypto = require("crypto");

function getIDFromStr(ip) {
    return crypto.createHash("sha1").update(ip).digest("hex");
};

module.exports = getIDFromStr;