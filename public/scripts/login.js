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
        $("#signin-overlay").fadIn(500);
    };

    const generateInput = function(name, label, placeholder, type = 'text'){
        return `<div class="form-entry"><label for="${name}">${label}</label>
        <input type=${type} id="${name}" name="${name}" placeholder="${placeholder}" required/></div>`
    }
    return {initialize, hide, show}
})();