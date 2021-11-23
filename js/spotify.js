window.onload = function(){

    const steroid = {
        // CORE VARIABLES
        url: 'https://steroidapp.ddns.net/',
        header: {'Content-Type': 'application/x-www-form-urlencoded'},
        errors: {
            offline: "Ooops, seems like Steroid's server is offline or under maintenance! Come back in a few minutes."
        },
        verification: async function(response){
            if (sessionStorage.getItem("session_token") != null && sessionStorage.getItem("user_id") != null){
                try {
                    response = await fetch(steroid.url+"verification", {
                        method: "POST",
                        headers: steroid.header,
                        body: "user_id="+sessionStorage.getItem("user_id")+"&session_token="+sessionStorage.getItem("session_token"),
                    });
                    response.status == 200 ? response = true : response = false;
                } catch {
                    response = {error: steroid.errors.offline}
                }
            }
            return response;
        },
        spotify: {
            request: async function(code, response){
                await fetch("https://accounts.spotify.com/api/token", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ZmY3NjYyZTAyMDg3NDk3MGEwMTAxNzNjMjA0MzljNTc6NzMwNmQ1ZGU0NWZjNGVlZDk0NDkzYjk3NTY0YmYxMTE='
                    },
                    body:
                        "grant_type=authorization_code" +
                        "&code=" + code +
                        "&redirect_uri=https%3A%2F%2Fsteroid-app.github.io%2Fdashboard.html"
                }).then(res => res.json().then( data => {
                    if (data.refresh_token !== undefined){
                        response = {refresh_token: data.refresh_token};
                    } else {
                        console.log(data);
                        response = {error: data.error + ": " + data.error_description};
                    }
                })).catch(response = {error: steroid.errors.offline});
                return response;
            },
            update: async function(response){
                await fetch(steroid.url+"spotify", {
                    method: "PATCH",
                    headers: steroid.header,
                    body: "user_id="+sessionStorage.getItem("user_id")+"&session_token="+sessionStorage.getItem("session_token")+"&refresh_token="+sessionStorage.getItem("refresh_token")
                }).then(res => {
                    switch(res.status){
                        case 201: response = true; break;
                        case 401: response = {error: "", code: 401}; break;
                        case 429: response = {error: "Too many Spotify refresh tokens attempts, come back in 24 hours.", code: 429}; break;
                    }
                }).catch(response = {error: steroid.errors.offline});
                return response;
            }
        },
    }

    // Spotify Integration elements
    const clientID = document.getElementById("client-id");
    const clientIDHelp = document.getElementById("client-id-help");
    const clientSecret = document.getElementById("client-secret");
    const clientSecretHelp = document.getElementById("client-secret-help");
    const activateSpotify = document.getElementById("activate-spotify");

    // Notification elements
    const notification = document.getElementById("notification");
    const notificationContainer = document.getElementById("notification-container");
    const notificationCloseButton = document.getElementById("notification-close-button");
    const notificationContent = document.getElementById("notification-content");
    const notificationHeader = document.getElementById("notification-header");
    const notificationText = document.getElementById("notification-text");

    activateSpotify.addEventListener("click", function(){
        if (clientID.value.length > 10){
            clientID.classList.remove("is-danger");
            clientID.classList.add("is-success");
            clientIDHelp.classList.add("is-hidden");
            if (clientSecret.value.length > 10){
                clientSecret.classList.remove("is-danger");
                clientSecret.classList.add("is-success");
                clientSecretHelp.classList.add("is-hidden");

                let data = btoa(clientID.value + ":" + clientSecret.value);
                let url = "https://accounts.spotify.com/authorize?" +
                    "client_id="+clientID.value+
                    "&response_type=code"+
                    "&scope=user-read-currently-playing&user-modify-playback-state"+
                    "&redirect_uri="+
                    encodeURIComponent("http://localhost:5500/spotify.html");
                window.location.href = url;

            } else {
                clientSecret.classList.remove("is-success");
                clientSecret.classList.add("is-danger");
                clientSecretHelp.classList.remove("is-hidden");
            }
        } else {
            clientID.classList.remove("is-success");
            clientID.classList.add("is-danger");
            clientIDHelp.classList.remove("is-hidden");
        }
    });

    notificationCloseButton.addEventListener("click", function(){
        notification.style.display = "none";
        document.getElementsByTagName("body")[0].style.overflow = "";
    });

    function clearSession(){
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("session_token");
        sessionStorage.removeItem("user_ip");
        sessionStorage.removeItem("newsletter_topics");
        sessionStorage.removeItem("weather_api");
        sessionStorage.removeItem("user_location");
        sessionStorage.removeItem("spotify_token");
        window.location.replace("/");
    }

    async function loadData(){
        let response = await steroid.verification();
        if (response){
            document.getElementsByTagName("body")[0].style.display = "block";
            let url = window.location.search;
            let splitted_url = url.split('?code=').pop();
            if (splitted_url !== ""){
                response = await steroid.spotify.request(splitted_url);
                if (response.refresh_token !== undefined){
                    sessionStorage.setItem("spotify_token",response.refresh_token);
                    response = await steroid.spotify.update();
                    if (response){
                        window.location.replace("/dashboard.html");
                    } else {
                        displayNotification(response); 
                    }
                } else {
                    displayNotification(response);
                }
            } 
        } else {
            clearSession();
        }
    }

    function displayNotification(text){
        if (text.error !== undefined){
            if (text.error.error_description !== undefined){
                notificationContainer.className = '';
                notificationContainer.classList.add("notification","is-danger","is-light");
                notificationHeader.className = '';
                notificationHeader.classList.add("has-text-danger");
                notificationHeader.innerText = "Error:";
                notificationText.innerText = text.error.error_description;
                document.getElementsByTagName("body")[0].style.overflow = "hidden";
                notification.style.display = "block";
            } else {
                notificationContainer.className = '';
                notificationContainer.classList.add("notification","is-danger","is-light");
                notificationHeader.className = '';
                notificationHeader.classList.add("has-text-danger");
                notificationHeader.innerText = "Error:";
                notificationText.innerText = text.error;
                document.getElementsByTagName("body")[0].style.overflow = "hidden";
                notification.style.display = "block";
            }
        } else {
            notificationContainer.className = '';
            notificationContainer.classList.add("notification","is-success","is-light");
            notificationHeader.className = '';
            notificationHeader.classList.add("has-text-success");
            notificationHeader.innerText = "Success:";
            notificationText.innerText = text.success;
            document.getElementsByTagName("body")[0].style.overflow = "hidden";
            notification.style.display = "block";
        }
    }

    loadData();

}