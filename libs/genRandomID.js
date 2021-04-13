// Generate a random id string

const crypto = require("crypto");

function genRandomID() {
    const date = new Date().getTime();
    const random = Math.random();
    return crypto.createHash("sha1").update(String(date+random)).digest("hex");
};

module.exports = genRandomID;