const Lobby = (function() { 
    let lobby_code = null;
    let lobby_state = null;
    const initialize = function(code, lobby){ 
        lobby_code = code;
        lobby_state = lobby;
        GamePanel.initialize();

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
            $(`.player-box:eq(${i})`).html(`<div class="player player-content" id=${id}>
            <img style="width:50%;image-rendering: pixelated;" src="../resources/${players[id].color}.png">
            <div class="username-label">${id}</div>
            </div>`);
            if (players[id].ready){
                $(`.player-box:eq(${i})`).append(`<div class="ready player-content" >READY</div>`);
                continue;
            }

            if (id == Authentication.getUser().id) addControls($(`.player-box:eq(${i})`));
            i++;
        }
        $(`.player-box:lt(${max_players})`).slice(Object.keys(players).length).html('<div class="waiting player-content">Waiting...</div>');
        $('.player-box').slice(max_players)
        .html('<div class="player-content"><img class="no-user player-content" src="../resources/no_player.svg"></div>');
    };

    const addControls = function(component){
        const player = Lobby.getLobbyState().players[Authentication.getUser().id];
        const left_colors = {"green":"blue", "blue":"orange", "orange":"green"};
        const right_colors = {"green":"orange", "blue":"green", "orange":"blue"};

        component.append(
            `<div class="controls">
            <div width="50%">
            <button class="control" id="left"><img width="100%" src="../resources/button_left.svg" alt="Button Left"></button>
            </div>
            <div width="50%" style="text-align: right">
            <button class="control" style="display: inline-block;" id="right">
            <img width="100%" src="../resources/button_right.svg" alt="Button Right">
            </button>
            </div>
            </div>`
        );

        $("#left").on("click", () => {
            Socket.changeColor(left_colors[player.color]);
        });

        $("#right").on("click", () => {
            Socket.changeColor(right_colors[player.color]);
        });
    }


    const removeControls = function(){
        $("#left").off("click");
        $("#right").off("click");
    }
    const updateUI = function(){
        const players = Lobby.getLobbyState().players;
        const max_players = parseInt(Lobby.getLobbySettings().n_players);
        let i = 0;
        removeControls();
        $(`.player-box:lt(${max_players})`).slice(Object.keys(players).length).html('<div class="waiting player-content">Waiting...</div>');
        for (id in players){
            $(`.player-box:eq(${i})`).html(`<div class="player player-content" id=${id}>
            <img style="width:50%;image-rendering: pixelated;" src="../resources/${players[id].color}.png">
            <div class="username-label">${id}</div>
            </div>`);
            if (players[id].ready){
                $(`.player-box:eq(${i})`).append(`<div class="ready player-content" >READY</div>`);
                continue;
            }
            if (id == Authentication.getUser().id){
                addControls($(`.player-box:eq(${i})`));
            }
            i++;
        }
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
