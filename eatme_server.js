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
    res.render("game");
})


// Use a web server to listen at port 8000
httpServer.listen(3000, '0.0.0.0', () => {
    console.log("The chat server has started...");
});