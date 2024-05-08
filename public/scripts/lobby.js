const Lobby = (function() {

    let code = null;

    const getCode = function() {
        return code;
    }

    // This function sends a sign-in request to the server
    const create = function(n_players, time, onSuccess, onError) {
        const json = JSON.stringify({"n_players":n_players, "time":time} )

        fetch("/create", { method : "POST", headers : { "Content-Type": "application/json" }, body : json})
        .then((res) => res.json() )
        .then((json) => {
            if (json.status == "error") { onError(json.error)}
            else if (json.status == "success") {
                code = json.lobby_code; 
                console.log("Lobby code : " + code);
                onSuccess();
            }
        })
        .catch((err) => {
            console.log(err);
            console.log("Error!");
        });
    };

    return { create };
})();
