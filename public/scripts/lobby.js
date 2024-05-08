const Lobby = (function() { 
    let lobby_code = null;
    const initialize = function(code){ lobby_code = code; console.log(lobby_code);}

    const getLobbyCode = function(){ return lobby_code; }

    const validate = function(onSuccess, onError){
        let code = JSON.stringify({code:Lobby.getLobbyCode()});
        fetch("/validate_lobby", { method : "POST", headers : { "Content-Type": "application/json" }, body : code})
        .then((res) => res.json() )
        .then((json) => {
            if (json.status == "success") {
                lobby_code = json.lobby_code; 
                onSuccess();
            } else {
                onError(json.error);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return { initialize, getLobbyCode, validate };
})();

const UserPanel = (function() {
    // This function initializes the UI
    const initialize = function() {
        console.log("Initialize user panel");
        $("#user-name").text("Welcome, " + Authentication.getUser().id);
    };

    $("#signout-button").on("click", (e) => {
        // Do not submit the form
        e.preventDefault();

        Authentication.signout(() => {
            window.location.href = "/login";
        })
    });

    return {initialize}
})();
