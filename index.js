const http = require("http");
const express = require("express");
const exphbs = require("express-handlebars");
const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const genRandomID = require('./libs/genRandomID');
const getError = require("./libs/getError");
const bodyParser = require("body-parser");
const {logger} = require("./libs/loggers");
const debugMiddleware = require("./libs/debugMiddleware");

const AuthKeys = [];

require("dotenv");

const md = new MarkdownIt();

const app = express();

app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: "main"
}));
app.set("view engine", ".hbs");

const server = http.createServer(app);

if (process.env.NODE_ENV !== "production") {
    app.use(debugMiddleware);
};

app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

app.use(function (req, res, next) {
    req.isLoggedIn = false;
    req.token = null;
    for (let i = 0; i < AuthKeys.length; i++) {
        if (req.cookies["AuthKey"] === AuthKeys[i].token && req.cookies["UserID"] === AuthKeys[i].token) {
            req.isLoggedIn = true;
            req.token = req.cookies["UserID"];
        }
    }
    next();
});

app.get("/", function (req, res) {
    res.render("home");
});
app.get("/:user/:doc", function (req, res) {
    fs.access(path.join(__dirname, `posts/md/${req.params.user}/${req.params.doc}.md`), fs.F_OK, (err) => {
        if (err) {
            //console.error("File Doesn't Exist", err);
            res.render("error", getError(404));
            return;
        }
        fs.access(path.join(__dirname, `posts/img/${req.params.user}/${req.params.doc}.md`), fs.F_OK, (err) => {
            if (err) {
                //console.error("File Doesn't Exist", err);
                res.render("error", getError(404));
                return;
            }
            fs.access(path.join(__dirname, `posts/meta/${req.params.user}/${req.params.doc}.md`), fs.F_OK, (err) => {
                if (err) {
                    //console.error("File Doesn't Exist", err);
                    res.render("error", getError(404));
                    return;
                }
                fs.readFile(path.join(__dirname, `posts/md/${req.params.user}/${req.params.doc}.md`), "utf8", function (err, markdown) {
                    if (err) {
                        //console.error("Could Not Read File", err);
                        res.render("error", getError(500));
                        return;
                    };
                    fs.readFile(path.join(__dirname, `posts/meta/${req.params.user}/${req.params.doc}.md`), "utf8", function (err, metaRaw) {
                        if (err) {
                            //console.error("Could Not Read File", err);
                            res.render("error", getError(500));
                            return;
                        };
                        //console.info(`Found Document "${req.params.name}"`);
                        const meta = JSON.parse(metaRaw);
                        res.render("doc", {
                            doc_title: meta.title,
                            doc_data: md.render(markdown.toString())
                        });
                    });
                });
            });
        });
    });
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    fs.readFile(path.join(__dirname, "users.json"), "utf8", function (err, data) {
        if (err) {
            //res.redirect('/login?msgId=pswincor');
            res.render("error", getError(500));
            return;
        };
        const passhash = crypto.createHash("sha1").update(req.body.password).digest("hex");
        const userlist = JSON.parse(data.toString());
        for (let i = 0; i < userlist.length; i++) {
            if (req.body.email === userlist[i].email && passhash === userlist[i].hash) {
                const authToken = genRandomID();
                AuthKeys.push({
                    id: userlist[i].id,
                    token: authToken
                });
                res.cookie("AuthKey", authToken);
                res.cookie("UserID", userlist[i].id);
                res.redirect("/?msgId=succusrreg");
                return;
            };
        };
        res.redirect('/login?msgId=pswincor');
    });
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    //console.info(req.body);
    if (req.body.password === req.body.confPassword) {
        fs.readFile(path.join(__dirname, "users.json"), "utf8", function (err, data) {
            if (err) {
                res.render("error", getError(500));
                return;
            };
            const finalUserList = JSON.parse(data.toString());
            for (let j = 0; j < finalUserList.length; j++) {
                if (finalUserList[j].email === req.body.email) {
                    res.redirect('/register?msgId=smemail');
                    return;
                };
            };
            const emailhash = crypto.createHash("sha1").update(req.body.email).digest("hex");
            const passhash = crypto.createHash("sha1").update(req.body.password).digest("hex");

            const body = {
                username: req.body.username,
                email: req.body.email,
                id: emailhash,
                hash: passhash
            };

            finalUserList.push(body);

            fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(finalUserList, null, 2), function (err) {
                if (err) {
                    res.render("error", getError(500));
                    return;
                };
                fs.mkdir(path.join(__dirname, `posts/md/${body.id}`), function (err) {
                    if (err) {
                        res.render("error", getError(500));
                        return;
                    };
                    fs.mkdir(path.join(__dirname, `posts/img/${body.id}`), function (err) {
                        if (err) {
                            res.render("error", getError(500));
                            return;
                        };
                        fs.mkdir(path.join(__dirname, `posts/meta/${body.id}`), function (err) {
                            if (err) {
                                res.render("error", getError(500));
                                return;
                            };
                            const authToken = genRandomID();
                            AuthKeys.push({
                                id: body.id,
                                token: authToken
                            });
                            res.cookie("AuthKey", authToken);
                            res.cookie("UserID", body.id);
                            res.redirect("/?msgId=succusrreg");
                        });
                    });
                });
            });
        });
    } else {
        res.redirect('/register?msgId=pswdntsim');
    };
});

app.use(function (req, res) {
    res.render("error", getError(404));
});

server.listen(80, _ => {
    logger.info(`Started server on *:80`);
});