const Lobby = (function() {
    let lobby_code = null;

    const getLobbyCode = function() {
        return lobby_code;
    }

    // This function sends a sign-in request to the server
    const create = function(n_players, time) {
        const json = JSON.stringify({"n_players":n_players, "time":time} )

        fetch("/create", { method : "POST", headers : { "Content-Type": "application/json" }, body : json})
        .then((res) => res.json() )
        .then((json) => {
            if (json.status == "success") {
                lobby_code = json.lobby_code; 
                Socket.enterLobby(lobby_code);
            }
        })
        .catch((err) => {
            console.log(err);
            console.log("Error!");
        });
    };

    const enter = function(code){
        lobby_code = code;
        Socket.enterLobby(lobby_code);
    }

    const setCode = function(code){
        lobby_code = code;
    }

    const showError = function(message){
        $("#enter-message").text(message);
    }

    return { getLobbyCode, create, enter, setCode, showError };
})();
