const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            console.log("Connected");
        });

        // Set up the remove user event
        socket.on("remove user", (user) => {
            console.log("Socket : Remove user")
            user = JSON.parse(user);
        });
    };

    const enterLobby = function(code) {
        if (socket && socket.connected) {
            socket.once("entered lobby " + Lobby.getLobbyCode(), (response) => {
                if (response.status == 'success'){
                    if (response.user.id == Authentication.getUser().id) window.location.href = "/lobby/" + response.code;
                    else console.log("User " + response.user.id + " has entered lobby.");
                } else {
                    if (response.user.id == Authentication.getUser().id) Lobby.showError(response.message);
                }
            });
     
            socket.emit("enter lobby", code);
        }
    }

    // This function disconnects the socket from the server
    const disconnect = function() {
        console.log("Disconnected socket")
        socket.disconnect();
        socket = null;
    };

    return { getSocket, connect, enterLobby, disconnect };
})();
