const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function(callback = () => {}) {
        socket = io();
        let code = Lobby.getLobbyCode();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            window.addEventListener('beforeunload', function() {
                // Emit the "handle end" event before disconnecting the socket
                disconnect();
            });
            callback();
        });

        socket.on("updated lobby " + code, (lobby) => {
            console.log("Lobby update");
            console.log(lobby);
            Lobby.updateLobbyState(lobby);
        })

        socket.on("left lobby " + code, (user) => {
            if (user.id == Authentication.getUser().id) {window.location.href = "/"}
            else {console.log("User " + user.id + " has left the lobby.")};
        });

        socket.on("entered lobby " + code, (response) => {
            if (response.status == 'success'){
                console.log("User " + response.user.id + " has entered lobby.");
            }
        });

        socket.on("start game " + code, () => {
            // REDIRECTS TO GAME HERE!!
            window.location.href = "/game/" + code;
        });
    };

    const ready = function(){
        if (socket && socket.connected) {
            socket.emit("ready", Lobby.getLobbyCode());
        }
    }

    const cancelReady = function(){
        if (socket && socket.connected) {
            socket.emit("cancel ready", Lobby.getLobbyCode());
        }
    }

    const leaveLobby = function() {
        if (socket && socket.connected) {
            socket.emit("leave lobby", Lobby.getLobbyCode());
        }
    }

    const changeColor = function(color){
        if (socket && socket.connected) {
            socket.emit("change color", Lobby.getLobbyCode(), color);
        }
    };

    const disconnect = function() {
        leaveLobby(Lobby.getLobbyCode());
        socket.disconnect();
        socket = null;
    };

    return { getSocket, connect, ready, cancelReady, changeColor, leaveLobby, disconnect };
})();
