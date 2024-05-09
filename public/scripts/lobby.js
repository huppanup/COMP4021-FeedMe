const Lobby = (function() { 
    let lobby_code = null;
    let lobby_state = null;
    const initialize = function(code, lobby){ 
        lobby_code = code;
        lobby_state = lobby;
        GamePanel.initialize();
        PlayerPanel.initialize();

        $("#ready").on('click', (e) => {
            e.preventDefault();
            Socket.ready();
            $("#ready").hide();
            $("#cancel").show();
        });

        $("#cancel").on('click', (e) => {
            e.preventDefault();
            Socket.cancelReady();
            $("#cancel").hide();
            $("#ready").show();
        });

        $("#leave-lobby").on('click', (e) => {
            e.preventDefault();
            Socket.leaveLobby();
        });
    }

    const getLobbyCode = function(){ return lobby_code; }
    const getLobbyState = function(){ return lobby_state; }
    const getLobbySettings = function(){ return lobby_state.settings; }

    const updateLobbyState = function(lobby){ 
        lobby_state = lobby;
        PlayerPanel.updateUI();
    }

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

    return { initialize, getLobbyCode, getLobbyState, updateLobbyState, getLobbySettings, validate };
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

const PlayerPanel = (function(){
    const initialize = function() {
        const players = Lobby.getLobbyState().players;
        const max_players = parseInt(Lobby.getLobbySettings().n_players);
        let i = 0;
        for (id in players){
            $(`.player-box:eq(${i})`).html(`<div class="player player-content" id=${id}>${id}</div>`);
            if (players[id].ready){
                $(`.player-box:eq(${i})`).append(`<div class="ready player-content" >READY</div>`);
            }
            i++;
        }
        $(`.player-box:lt(${max_players})`).slice(Object.keys(players).length).html('<div class="waiting player-content">Waiting...</div>');
        $('.player-box').slice(max_players)
        .html('<div class="player-content"><img class="no-user player-content" src="../resources/no_player.svg"></div>');
    };

    const updateUI = function(){
        const players = Lobby.getLobbyState().players;
        const max_players = parseInt(Lobby.getLobbySettings().n_players);
        let i = 0;
        for (id in players){
            console.log(players);
            $(`.player-box:eq(${i})`).html(`<div class="player player-content" id=${id}>${id}</div>`);
            if (players[id].ready){
                $(`.player-box:eq(${i})`).append(`<div class="ready player-content" >READY</div>`);
            }
            i++;
        }
        $(`.player-box:lt(${max_players})`).slice(Object.keys(players).length).html('<div class="waiting player-content">Waiting...</div>');
    };

    return {initialize, updateUI}

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
