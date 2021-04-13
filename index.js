// Get Environment Variables from .env
require("dotenv").config();

// Load Modules
const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const fs = require("fs");
const path = require("path");
const genRandomID = require("./libs/genRandomID");
const Logger = require("./libs/logger");

// Create Logger
const logger = new Logger({
    use_colors: true,
    log_level: 0
});

// Create Web Server
const app = express();
const server = http.createServer(app);

// Set Express Rendering Engine
app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: "main"
}));

// Config Express App
app.set("view engine", ".hbs");
app.set('trust proxy', true);

// Express Middleware
app.use(express.static("public"));

// Main Endpoints
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/embed", function (req, res) {
    res.render("home", {
        layout: "embed",
        doc_title: "Test",
        user_name: "Test",
        doc_time: "Test"
    });
});

app.get("/new", function (req, res) {
    res.render("new");
});

// Start Web Server
server.listen(Number(process.env.PORT), function () {
    logger.info(`Started Server at *:${process.env.PORT}`);
});