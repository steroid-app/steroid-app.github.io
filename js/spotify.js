window.onload = function(){

    const steroid = {
        spotify: {
            request: async function(code, response){
                await fetch("https://accounts.spotify.com/api/token", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic '+btoa(sessionStorage.getItem("clientID")+":"+sessionStorage.getItem("clientSecret"))
                    },
                    body:"grant_type=authorization_code&code="+code+"&redirect_uri="+encodeURIComponent("https://steroid-app.github.io/spotify.html")
                }).then(res => res.json().then( data => {
                    if (data.refresh_token !== undefined){
                        response = {refresh_token: data.refresh_token};
                    } else {
                        response = {error: data.error + ": " + data.error_description};
                    }
                })).catch(response = {error: "Ooops, seems like Steroid's server is offline or under maintenance! Come back in a few minutes."});
                return response;
            }
        }
    }

    // Spotify Integration elements
    const clientID = document.getElementById("client-id");
    const clientIDHelp = document.getElementById("client-id-help");
    const clientSecret = document.getElementById("client-secret");
    const clientSecretHelp = document.getElementById("client-secret-help");
    const refreshToken = document.getElementById("refresh-token");
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
                sessionStorage.setItem("clientID", clientID.value);
                sessionStorage.setItem("clientSecret", clientSecret.value);
                let url = "https://accounts.spotify.com/authorize?client_id="+clientID.value+"&response_type=code&scope=user-read-currently-playing&user-modify-playback-state&redirect_uri="+encodeURIComponent("https://steroid-app.github.io/spotify.html");
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

    async function loadData(){
        document.getElementsByTagName("body")[0].style.display = "block";
        let url = window.location.search;
        let splitted_url = url.split('?code=').pop();
        if (splitted_url !== ""){
            response = await steroid.spotify.request(splitted_url);
            if (response.refresh_token !== undefined){
                clientID.value = sessionStorage.getItem("clientID");
                clientSecret.value = sessionStorage.getItem("clientSecret");
                refreshToken.value = response.refresh_token;
                clientID.classList.add("is-success");
                clientSecret.classList.add("is-success");
                refreshToken.classList.add("is-success");
                document.getElementById("refresh-token-field").classList.remove("is-hidden");
                document.getElementById("first-content").classList.add("is-hidden");
                document.getElementById("how-to-setup").classList.add("is-hidden");
                document.getElementById("second-content").classList.remove("is-hidden");
                activateSpotify.classList.add("is-hidden");
            } else {
                displayNotification(response);
            }
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