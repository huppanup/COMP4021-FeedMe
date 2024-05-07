const Authentication = (function() {
    // This stores the current signed-in user
    let user = null;

    // This function gets the signed-in user
    const getUser = function() {
        return user;
    }

    // This function sends a sign-in request to the server
    const signin = function(id, password, onSuccess, onError) {
        const json = JSON.stringify({"id":id, "password":password} )
        console.log(json);

        fetch("/signin", { method : "POST", headers : { "Content-Type": "application/json" }, body : json})
        .then((res) => res.json() )
        .then((json) => {
            if (json.status == "error") { onError(json.error)}
            else if (json.status == "success") {
                user = json.user; 
                onSuccess();
            }
        })
        .catch((err) => {
            console.log(err);
            console.log("Error!");
        });
    };

    const register = function(id, password, onSuccess, onError){
        const json = JSON.stringify({"id":id, "password":password} )

        fetch("/register", { method : "POST", headers : { "Content-Type": "application/json" }, body : json})
        .then((res) => res.json() )
        .then((json) => {
            if (json.status == "error") { onError(json.error)}
            else if (json.status == "success") onSuccess();
        })
        .catch((err) => {
            console.log("Error!");
        });
    }

    const validate = function(onSuccess, onError) {
        fetch("/validate")
        .then((res) => res.json() )
        .then((json) => {
            if (json.status == "error") { onError(json.error)}
            else if (json.status == "success") {
                user = json.user; 
                onSuccess();
            }
        })
        .catch((err) => {
            console.log(err);
            console.log("Error!");
        });
    };

    const signout = function(onSuccess, onError) {
        fetch("/signout")
        .then((res) => res.json() )
        .then((json) => {
            if (json.status == "success") {
                user = null; 
                onSuccess();
            }
        })
        .catch((err) => {
            console.log("Error!");
        });
    };

    return { getUser, signin, register, validate, signout };
})();
