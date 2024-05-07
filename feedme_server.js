const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

const app = express();

// Use ejs
app.set("view engine", "ejs")

// Initialize Websocket

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer( app );
const io = new Server(httpServer);

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const gameSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});

app.use(gameSession);

io.use((socket, next) => {
    gameSession(socket.request, {}, next);
});

// List of open rooms
const rooms = {};

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}
// Handle requests
app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/', (req, res) => {
    res.redirect("/login");
})

app.get('/game', (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.render("game", {user : req.session.user});
})

// POST
app.post("/signin", (req, res) => {
    const { id, password } = req.body;
    console.log(req.body)

    const users = JSON.parse(fs.readFileSync("data/users.json"));
    if (! (id in users)) return res.json({status : "error", error : `Error : User ID does not exist.`});

    const hashedPassword = users[id].password;
    if (!bcrypt.compareSync(password, hashedPassword)) return res.json({status : "error", error : `Error : Incorrect password.`});

    const userInfo = {id : id, scores : users[id].scores };
    req.session.user = userInfo;
    res.json({ status: "success", user : userInfo});
});

app.post("/register", (req, res) => {
    const { id, password } = req.body;

    const users = JSON.parse(fs.readFileSync("data/users.json"));

    if (!containWordCharsOnly(id)) return res.json({status : "error", error :"Error : Your ID should only contain underscores, letters or numbers."});
    if (id in users) return res.json({status : "error", error : `Error : The ID '${id}' already exists in the system.`});

    const hash = bcrypt.hashSync(password, 10);
    users[id] = {password : hash, scores : []};

    fs.writeFileSync("data/users.json",JSON.stringify(users, null, " " ))

    return res.json({ status: "success" });
});

// GET

app.get("/validate", (req, res) => {

    const user = req.session.user;

    if (!user) return res.json({status : "error", error : "Error : User validation failed"})
    
    return res.json({ status: "success", user : user})
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    delete req.session.user;

    res.json({ status : "success"});
});

// WebSocket
// Handle Websocket
io.on("connection", (socket) => {
    const user = socket.request.session.user;

    socket.on("disconnect", () => {
        const user = socket.request.session.user;
        io.emit("remove user", JSON.stringify({username: user.username, avatar : user.avatar, name : user.name}));
    })
    
});


// Use a web server to listen at port 3000
httpServer.listen(3000, '0.0.0.0', () => {
    console.log("The chat server has started...");
});