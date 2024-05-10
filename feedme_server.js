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

// List of open lobbies
const lobbies = {};

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

function generateLobbyCode() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 4) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

// Handle requests
app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/', (req, res) => {
    res.redirect("/login");
})

app.get('/game/:code?', (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    // You might want to send lobby info too, like below.
    res.render("game", {user : req.session.user});

    }

//     const user = req.session.user;
//     let userLobby = null;

//     //dummy
//     lobbies["1234"] = {
//         "settings" : {"n_players" : 2, "time" : 30 },
//         "players" : {"id1" : {"color" : "green"}}}

//     // Find the lobby that the user is in
//     for (const [code, lobby] of Object.entries(lobbies)) {
//         if (lobby.players) {
//             userLobby = {code, ...lobby};
//             break;
//         }
//     }

//     if (!userLobby) {
//         return res.redirect("/lobby");
//     }

//     res.render("game", {
//         user: user,
//         lobbyCode: userLobby.code,
//         settings: userLobby.settings,
//         playersData: userLobby.players
//     });
);

app.get('/lobby/:code?', (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    if (!lobbies[req.params.code]) return res.redirect("/login");
    const lobby = JSON.stringify(lobbies[req.params.code], null, 0);
    res.render("lobby", {code: req.params.code, lobby: lobby });
})

// POST
app.post("/signin", (req, res) => {
    const { id, password } = req.body;

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

app.post("/create", (req, res) => {
    const { n_players, time } = req.body;

    let lobbyCode = generateLobbyCode();
    while ( lobbyCode in lobbies ){ lobbyCode = generateLobbyCode(); }
    lobbies[lobbyCode] = {"settings" : {"n_players" : n_players, "time" : time}, "players" : {}}
    res.json({ status: "success", lobby_code : lobbyCode});
});

app.post("/validate_lobby", (req, res) => {
    const {code} = req.body;

    const user = req.session.user;

    if (!(code in lobbies)) return res.json({status : "error", error : "Error : The lobby does not exist."});
    if (!(user.id in lobbies[code].players)) return res.json({status : "error", error : "Error : You are not in this lobby."})
    
    return res.json({ status: "success"})
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
    console.log(user?.id + " connected to socket");

    socket.on("enter lobby", (code) => {
        if (code in lobbies){
            if (parseInt(lobbies[code].settings.n_players) <= Object.keys(lobbies[code].players).length){
                io.emit("entered lobby " + code, {status: "error", user: user, message : `Error : Lobby ${code} is already full.`});
            } else {
                lobbies[code].players[user.id] = {color : "green", ready : false};
                io.emit(`entered lobby ${code}`, {status: "success", user : user, code : code});
                io.emit("updated lobby " + code, lobbies[code]);
            }
        } else {
            io.emit("entered lobby " + code, {status: "error", user: user, message : `Error : Lobby ${code} does not exist`});
        }  
    });

    socket.on("ready", (code) => {
        const players = lobbies[code].players;
        players[user.id].ready = true;
        let startGame = true;
        for(id in players){
            if (!players[id].ready) startGame = false;
        }
        if (startGame){io.emit("start game " + code);}
        else {io.emit("updated lobby " + code, lobbies[code]);}
    });

    socket.on("cancel ready", (code) => {
        lobbies[code].players[user.id].ready = false;
        io.emit("updated lobby " + code, lobbies[code]);
    });

    socket.on("change color", (code, color) =>{
        lobbies[code].players[user.id].color = color;
        io.emit("updated lobby " + code, lobbies[code]);
    });

    socket.on("leave lobby", (code) => {
        if (!lobbies[code]) return;
        if (!lobbies[code].players[user.id]) return;
        let gameStart = true;
        for (id in lobbies[code].players){if (!lobbies[code].players[id].ready) gameStart = false;}
        if (gameStart) return;
        // Remove user from lobby
        delete lobbies[code].players[user.id];
        // Delete lobby if no users remain
        if (Object.keys(lobbies[code].players).length == 0){
            console.log("Lobby "+ code + " empty, removing...");
            delete lobbies[code];
        } else {
            io.emit("updated lobby " + code, lobbies[code]);
        }
        io.emit("left lobby " + code, user);
    })

    socket.on("disconnect", () => {
        console.log("Disconnecting socket...");
        socket.disconnect();
    })
    
});


// Use a web server to listen at port 3000
httpServer.listen(3000, '0.0.0.0', () => {
    console.log("The chat server has started...");
});