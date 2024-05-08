const SignInForm = (function() {
    // This function initializes the UI
    const initialize = function() {
        $('#signin-form').append(generateInput('signin-uid', 'User ID', 'Enter your ID'));
        $('#signin-form').append(generateInput('signin-pw', 'Password', 'Enter your password', 'password'));
        $('#signin-form').append('<button style="margin-top:10px" type="submit">Sign In</button>');
        $('#signin-form').append('<div id="signin-message" class="warning center"></div>');


        $('#register-form').append(generateInput('register-uid', 'User ID', 'Enter your ID'));
        $('#register-form').append(generateInput('register-pw', 'Password', 'Enter your password', 'password'));
        $('#register-form').append(generateInput('register-confirmpw', 'Re-enter Password', 'Re-enter your password', 'password'));
        $('#register-form').append('<button style="margin-top:10px" type="submit">Register</button>')
        $('#register-form').append('<div id="register-message" class="warning center"></div>');

    };

    $("#signin-form").on("submit", (e) => {
        // Do not submit the form
        e.preventDefault();

        // Get the input fields
        const username = $("#signin-uid").val().trim();
        const password = $("#signin-pw").val().trim();

        // Send a signin request
        Authentication.signin(username, password,
            () => {
                hide();
                Socket.connect();
                LobbyForm.show();
                // Redirect should not happen here! Will be changed.
                //window.location.href = "/game";
            },
            (error) => { clear(); $("#signin-message").text(error); }
        );
    });

    $("#register-form").on("submit", (e) => {
        // Do not submit the form
        e.preventDefault();

        // Get the input fields
        const id = $("#register-uid").val().trim();
        const password = $("#register-pw").val().trim();
        const confirmpw = $('#register-confirmpw').val().trim();

        if (password != confirmpw) {
            $("#register-message").text("Passwords do not match.");
            return;
        }

        // Send a signin request
        Authentication.register(id, password,
            () => {
                clear();
                $("#register-message").text("You can sign in now.");
            },
            (error) => { clear(); $("#register-message").text(error); }
        );
    });

    const clear = function() {
        $("#signin-form").get(0).reset();
        $("#register-form").get(0).reset();
        $("#signin-message").text("");
        $("#register-message").text("");
    }

    const hide = function() {
        clear();
        $("#signin-overlay").fadeOut(500);
    };

    const show = function() {
        $("#signin-overlay").fadeIn(500);
    };

    const generateInput = function(name, label, placeholder, type = 'text'){
        return `<div class="form-entry"><label for="${name}">${label}</label>
        <input type=${type} id="${name}" name="${name}" placeholder="${placeholder}" required/></div>`
    }
    return {initialize, hide, show}
})();

const LobbyForm = (function() {
    // This function initializes the UI
    const initialize = function() {
    };

    $("#create-form").on("submit", (e) => {
        // Do not submit the form
        e.preventDefault();

        // Get the input fields
        const n_players = $('input[name="n_players"]:checked').val().trim();
        const time = $('input[name="time"]:checked').val().trim();

        console.log(n_players, time)

        Lobby.create(n_players, time, () => {console.log("Created lobby!"), () => {console.log("Failed to create lobby.")}});
    });

    const clear = function() {
        $("#create-form").get(0).reset();
        $("#enter-form").get(0).reset();
        $("#create-message").text("");
        $("#enter-message").text("");
    }

    const hide = function() {
        clear();
        $("#enterlobby-overlay").fadeOut(500);
    };

    const show = function() {
        console.log("lobby overlay fade in");
        $("#enterlobby-overlay").fadeIn(500);
    };

    return {initialize, hide, show}
})();