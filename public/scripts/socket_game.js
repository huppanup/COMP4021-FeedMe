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
        let code = /*TODO: Write a function to get the lobby code */ "temp";

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
        });

        socket.on("end game " + code, () => {
            // TODO: Executes when all users have ended their games for this lobby. Handle game end action here.
        })
    };

    const updateScore = function(lobbyCode, score) {
        Socket.emit("update score", lobbyCode, score);
    };


    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    return { getSocket, connect, updateScore, disconnect };
})();
