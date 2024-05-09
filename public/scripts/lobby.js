const Lobby = (function() { 
    let lobby_code = null;
    let lobby_settings = null;
    const initialize = function(code, n, time){ 
        lobby_code = code;
        lobby_settings = {n_players:n, time:time};
        GamePanel.initialize();
        $("#leave-lobby").on('click', (e) => {
            e.preventDefault();
            Socket.leaveLobby(code);
        });
    }

    const getLobbyCode = function(){ return lobby_code; }
    const getLobbySettings = function(){ return lobby_settings; }



    const validate = function(onSuccess, onError){
        let code = JSON.stringify({code: Lobby.getLobbyCode()});
        fetch("/validate_lobby", { method : "POST", headers : { "Content-Type": "application/json" }, body : code})
        .then((res) => res.json() )
        .then((json) => {
            if (json.status == "success") {
                onSuccess();
            } else {
                onError(json.error);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return { initialize, getLobbyCode, getLobbySettings, validate };
})();

const GamePanel = (function(){
    const initialize = function() {
        const lobby_settings = Lobby.getLobbySettings();

        const lobbyCodeComponent = `
        <div class="settings-component col">
        <div class="settings-label">CODE</div>
        <div class="settings-content col center">${Lobby.getLobbyCode()}</div>
        </div>
        `;
        const nPlayerComponent = `
        <div class="settings-component col">
        <div class="settings-label">NO. PLAYERS</div>
        <div class="settings-content col center">${lobby_settings.n_players}</div>
        </div>
        `;
        const timeComponent = `
        <div class="settings-component col">
        <div class="settings-label">TIME LIMIT</div>
        <div class="settings-content col center">${lobby_settings.time} S</div>
        </div>
        `;

        $("#lobby-settings").append(lobbyCodeComponent, nPlayerComponent, timeComponent);
    };

    return {initialize}
})();

const UserPanel = (function() {
    // This function initializes the UI
    const initialize = function() {
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
