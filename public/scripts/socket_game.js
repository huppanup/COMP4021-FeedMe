const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function(lobbyCode, user, callback = () => {}) {
        socket = io();

        // Join the lobby
        socket.emit("enter lobby", lobbyCode);

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            console.log("Connected to server");
            callback();
        });

        // updated scores event
        socket.on("updated scores " + lobbyCode, (players) => {
            updateResultsTable(players)
        });

        socket.on("end game " + lobbyCode, (players) => {
            displayResults(players);
            setTimeout(() => {
                window.location.href = `/lobby/${lobbyCode}`;
            }, 10000); // Redirect after 10 seconds
        });
    };

    const displayResults = function(players) {
        //$('#results-box').removeClass('hidden');
        $('#game-over').removeClass('hidden');
        $('#timer-box').addClass('hidden');
        $('#score-box').addClass('hidden');
        $('#game-area').hide();

        const tbody = $('#results-table tbody');
        tbody.empty();

        let highestScore = -Infinity;
        let winner = '';

        Object.entries(players).forEach(([playerId, playerData]) => {
            const row = `<tr><td>${playerId}</td><td>${playerData.score}</td></tr>`;
            tbody.append(row);
            if (playerData.score > highestScore) {
                highestScore = playerData.score;
                winner = playerId;
            }
        });

        $('#winner-text').text(`Winner: ${winner}`);
    };

    const updateScore = function(lobbyCode, score) {
        socket.emit("update score", lobbyCode, score);
    };

    // Update results table
    const updateResultsTable = function(players) {
        const tbody = $('#results-table tbody');
        tbody.empty();

        Object.entries(players).forEach(([playerId, playerData]) => {
            console.log("player in results table: ", playerId)
            const row = `<tr><td>${playerId}</td><td>${playerData.score}</td></tr>`;
            tbody.append(row);
        });
    };


    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    return { getSocket, connect, updateScore, disconnect };
})();
