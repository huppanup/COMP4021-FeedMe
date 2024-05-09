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


    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    return { getSocket, connect, enterLobby, disconnect };
})();
