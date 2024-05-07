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

    // This function disconnects the socket from the server
    const disconnect = function() {
        console.log("Disconnected socket")
        socket.disconnect();
        socket = null;
    };

    return { getSocket, connect, disconnect };
})();
