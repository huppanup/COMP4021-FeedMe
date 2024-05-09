const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

const app = express();

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
// Handle Requests
// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { id, password } = req.body;

    const users = JSON.parse(fs.readFileSync("data/users.json"));

    if (!(id && password)) return res.json({status : "error", error : "Error : You have an empty input field."});
    if (!containWordCharsOnly(id)) return res.json({status : "error", error :"Error : Your ID should only contain underscores, letters or numbers."});
    if (id in users) return res.json({status : "error", error : `Error : The id '${id}' already exists in the system.`});

    const hash = bcrypt.hashSync(password, 10);
    users[id] = {password : hash, scores : []};

    fs.writeFileSync("data/users.json",JSON.stringify(users, null, " " ))

    return res.json({ status: "success" });
});

app.post("/signin", (req, res) => {
    const { id, password } = req.body;

    const users = JSON.parse(fs.readFileSync("data/users.json"));

    if (! id in users) return res.json({status : "error", error : `Error : ID does not exist.`});

    const hashedPassword = users[id].password;
    if (!bcrypt.compareSync(password, hashedPassword)) return res.json({status : "error", error : `Error : Incorrect password.`});

    const userInfo = {id : id, scores : users[id].scores };
    req.session.user = userInfo;
    res.json({ status: "success", user : userInfo});
});

// Handle the /validate endpoint
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

// Handle Websocket
io.on("connection", (socket) => {
    // Add a new user to the online user list
    const user = socket.request.session.user;
    if (user) {
        onlineUsers[user.username] = {avatar : user.avatar, name : user.name}; 
        io.emit("add user", JSON.stringify({username: user.username, avatar : user.avatar, name : user.name}));
    }

    socket.on("get messages", () => {
        const chatroom = JSON.parse(fs.readFileSync("data/chatroom.json"));
        io.emit('messages', JSON.stringify(chatroom));
    });

    socket.on("post message", (content) => {
        const user = socket.request.session.user;
        const chatroom = JSON.parse(fs.readFileSync("data/chatroom.json"));

        const message = {
            user: {user: user.username, avatar : user.avatar, name : user.name},
            datetime: new Date(),
            content: content
        }

        chatroom.push(message);
        fs.writeFileSync("data/chatroom.json",JSON.stringify(chatroom, null, " " ));
        io.emit("add message", JSON.stringify(message));

    });

    socket.on("is typing", () => {
        io.emit("update status", JSON.stringify(socket.request.session.user));
    })

    socket.on("disconnect", () => {
        const user = socket.request.session.user;
        if (user) {
            delete onlineUsers[user.username];
        }
        io.emit("remove user", JSON.stringify({username: user.username, avatar : user.avatar, name : user.name}));
    })

    socket.on("get users", () => socket.emit("users", JSON.stringify(onlineUsers)));
    
    
});




// Use a web server to listen at port 8000
httpServer.listen(3000, '0.0.0.0', () => {
    console.log("The chat server has started...");
});