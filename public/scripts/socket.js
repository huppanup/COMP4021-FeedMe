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

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            window.addEventListener('beforeunload', function() {
                // Emit the "handle end" event before disconnecting the socket
                disconnect();
            });
            callback();
        });
    };

    const enterLobby = function(code) {
        if (socket && socket.connected) {
            socket.on("entered lobby " + code, (response) => {
                if (response.status == 'success'){
                    if (response.user.id == Authentication.getUser().id) window.location.href = "/lobby/" + response.code;
                } else {
                    if (response.user.id == Authentication.getUser().id){
                        LobbyForm.showError(response.message);
                        LobbyForm.setCode(null);
                    }
                }
            });
            socket.emit("enter lobby", code);
        }
    }

    const checkLeave = function(code){
        if (socket && socket.connected) {
            socket.on("left lobby " + code, (user) => {
                if (user.id == Authentication.getUser().id) {window.location.href = "/"}
                else {console.log("User " + user.id + " has left the lobby.")};
            });
        }
    }

    const checkEnter = function(code){
        if (socket && socket.connected) {
            socket.on("entered lobby " + code, (response) => {
                if (response.status == 'success'){
                    if (response.user.id == Authentication.getUser().id) console.log("You've entered the lobby!");
                    else console.log("User " + response.user.id + " has entered lobby.");
                }
            });
        }
    }

    const leaveLobby = function(code) {
        if (socket && socket.connected) {
            socket.emit("leave lobby", code);
        }
    }



    // This function disconnects the socket from the server
    const disconnect = function() {
        try{
            leaveLobby(Lobby.getLobbyCode());
        } catch(e) {};
        socket.disconnect();
        socket = null;
    };

    return { getSocket, connect, checkLeave, checkEnter, enterLobby, leaveLobby, disconnect };
})();
