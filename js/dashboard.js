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
        token: async function(response){
            await fetch(steroid.url+"token", {
                method: "POST",
                headers: steroid.header,
                body: "user_id="+sessionStorage.getItem("user_id")+"&session_token="+sessionStorage.getItem("session_token")+"&wallpaper_token="+sessionStorage.getItem("wallpaper_token"),
            }).then(res => {
                switch(res.status){
                    case 200: response = res.json(); break;
                    case 401: response = {error: "", code: 401}; break;
                    case 429: response = {error: "Too many token refresh attempts, come back in 24 hours.", code: 429}; break;
                }
            }).catch(response = {error: steroid.errors.offline});
            return response;
        },
        spotify: {
            get_code: function(){
                let url = "https://accounts.spotify.com/authorize?client_id=ff7662e020874970a010173c20439c57&response_type=code&scope=user-read-currently-playing&user-modify-playback-state&redirect_uri="+encodeURIComponent("https://steroid-app.github.io/dashboard.html");
                window.location.href = url;
            },
            request: async function (code, response){
                await fetch("https://accounts.spotify.com/api/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "Basic ZmY3NjYyZTAyMDg3NDk3MGEwMTAxNzNjMjA0MzljNTc6NzMwNmQ1ZGU0NWZjNGVlZDk0NDkzYjk3NTY0YmYxMTE="
                    },
                    body: "grant_type=authorization_code&code="+code+"&redirect_uri="+encodeURIComponent("https://steroid-app.github.io/dashboard.html")
                }).then(res => res.json().then(data => {
                    if (data.refresh_token !== undefined){
                        response = {refresh_token: data.refresh_token}
                    } else {
                        response = {error: data.error+": "+data.error_description};
                    }
                })).catch(response = {error: steroid.errors.offline});
                return response;
            },
            update: async function(refresh_token, response){
                await fetch(steroid.url+"spotify", {
                    method: "PATCH",
                    headers: steroid.header,
                    body: "user_id="+sessionStorage.getItem("user_id")+"&session_token="+sessionStorage.getItem("session_token")+"&refresh_token="+refresh_token
                }).then(res => {
                    switch (res.status){
                        case 201:
                            response = {success: "Spotify has been integrated correctly, refreshing the dashboard in a few seconds..."};
                            sessionStorage.setItem("spotify_token", refresh_token);
                            break;
                        case 401:
                            response = {error: "", code: 401};
                            break;
                        case 429:
                            response = {error: "Too many Spotify integration attempts, come back in 24 hours.", code: 429};
                            break;
                    }
                }).catch(response = {error: steroid.errors.offline});
                return response;
            }
        },
        weather: {
            update: async function(weather_api_key, location, response){
                await fetch(steroid.url+"weather", {
                    method: "PATCH",
                    headers: steroid.header,
                    body: "user_id="+sessionStorage.getItem("user_id")+"&session_token="+sessionStorage.getItem("session_token")+"&weather_api="+weather_api_key+"&user_location="+location
                }).then(res => {
                    switch(res.status){
                        case 201: response = true; break;
                        case 401: response = {error: "", code: 401}; break;
                        case 429: response = {error: "Too many weather data save attempts, come back in 24 hours.", code: 429}; break;
                    }
                }).catch(response = {error: steroid.errors.offline});
                return response;
            }
        }
    }

    //Nav bar
    const closeSession = document.getElementById("close-session-button");

    // User Details
    const userDetails = document.getElementById("display-user-fields");
    const wallpaperTokenContainer = document.getElementById("wallpaper-token-container");
    const wallpaperTokenInput = document.getElementById("wallpaper-token-input");
    const wallpaperTokenResetButton = document.getElementById("wallpaper-token-reset-button");
    var awaitingToken = false;
    
    // Spotify Button
    const spotifyButton = document.getElementById("connect-spotify-button");
    const refreshSpotify = document.getElementById("refresh-spotify");

    // Weather API
    const weatherAPIInput = document.getElementById("weather-api-key-input");
    const weatherCityInput = document.getElementById("weather-city-input");
    const weatherAPIShowButton = document.getElementById("weather-api-show-button");
    const weatherCityShowButton = document.getElementById("weather-city-show-button");
    const weatherSaveButton = document.getElementById("save-weather");

    // Notification elements
    const notification = document.getElementById("notification");
    const notificationContainer = document.getElementById("notification-container");
    const notificationCloseButton = document.getElementById("notification-close-button");
    const notificationContent = document.getElementById("notification-content");
    const notificationHeader = document.getElementById("notification-header");
    const notificationText = document.getElementById("notification-text");

    // Event Listener Assignament
    closeSession.addEventListener("click", function(){
        clearSession();
    });

    wallpaperTokenResetButton.addEventListener('click', async function(){
        if (!awaitingToken){
            let data = await steroid.token();
            if (data.code == undefined){
                awaitingToken = true;
                wallpaperTokenResetButton.children[0].style.animation = "rotation infinite 1s cubic-bezier(0.165, 0.84, 0.44, 1)";
                wallpaperTokenResetButton.style.cursor = "default";
                setTimeout(function() {
                    wallpaperTokenInput.style.animation = "glow alternate-reverse 2s ease-in-out";
                    setTimeout(() => {
                        wallpaperTokenInput.style.animation = "";
                        wallpaperTokenResetButton.children[0].style.animation = "";
                        wallpaperTokenResetButton.style.cursor = "pointer";
                        awaitingToken = false;
                    }, 2000);
                    sessionStorage.setItem("wallpaper_token", data.wallpaper_token);
                    wallpaperTokenInput.value = data.wallpaper_token;
                }, 2000);
            } else {
                data.code != 401 ? displayNotification(data) : false;
            }
        }
    });

    userDetails.addEventListener("click", function(){
        if (userDetails.classList.contains("off")){
            document.getElementById("username-data").innerText =sessionStorage.getItem('user_id');
            document.getElementById("ip-data").innerText = sessionStorage.getItem('user_ip');
            userDetails.classList.replace("off", "on");
        } else {
            let user_id = sessionStorage.getItem('user_id');
            user_id = user_id.split("@");
            user_id[0] = user_id[0].replace(/./gi, "*");
            document.getElementById("username-data").innerText = user_id[0]+"@"+user_id[1];
            let ip = sessionStorage.getItem('user_ip');
            ip = ip.replace(/./gi, "*");
            document.getElementById("ip-data").innerText = ip;
            userDetails.classList.replace("on", "off");
        }
    });

    spotifyButton.addEventListener("click", function(){
        steroid.spotify.get_code();
        //displayNotification({success: "Spotify integration is currently disabled. Tomorrow 24/11/2021 will resume activity at 16:00hs -3 UTC."});
    });

    refreshSpotify.addEventListener("click", function(){
        steroid.spotify.get_code();
        //displayNotification({success: "Spotify integration is currently disabled. Tomorrow 24/11/2021 will resume activity at 16:00hs -3 UTC."});
    });

    weatherAPIShowButton.addEventListener("click", function(){
        if (weatherAPIInput.attributes["type"].value == "password"){
            weatherAPIInput.setAttribute('type','text');
            weatherAPIShowButton.children[0].classList.replace("fa-eye-slash", "fa-eye");
        } else {
            weatherAPIInput.setAttribute('type','password');
            weatherAPIShowButton.children[0].classList.replace("fa-eye", "fa-eye-slash");
        }
        weatherAPIShowButton.classList.toggle("has-text-grey-light");
    });

    weatherCityShowButton.addEventListener("click", function(){
        if (weatherCityInput.attributes["type"].value == "text"){
            weatherCityInput.setAttribute('type','password');
            weatherCityShowButton.children[0].classList.replace("fa-eye", "fa-eye-slash");
        } else {
            weatherCityInput.setAttribute('type','text');
            weatherCityShowButton.children[0].classList.replace("fa-eye-slash", "fa-eye");
        }
        weatherCityShowButton.classList.toggle("has-text-grey-light");
    });

    weatherSaveButton.addEventListener("click", async function(){
        weatherSaveButton.classList.add("is-loading");
        document.getElementsByTagName("body")[0].style.pointerEvents = "none";
        if (weatherAPIInput.value !== "" && weatherCityInput.value !== "" && weatherAPIInput.value.length > 10 && weatherCityInput.value.length > 5){
            weatherAPIInput.value = weatherAPIInput.value.replace(/[\t]/g, "");
            let response = await steroid.weather.update(weatherAPIInput.value, weatherCityInput.value);
            if (response.code == undefined){
                displayNotification({success: "Weather settings have been saved."});
            } else {
                displayNotification(response);
            }
        }
        weatherSaveButton.classList.remove("is-loading");
        document.getElementsByTagName("body")[0].style.pointerEvents = "auto";
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
        sessionStorage.removeItem("wallpaper_token");
        weatherAPIInput.value = "";
        weatherCityInput.value = "";
        window.location.replace("/");
    }

    async function loadData(){
        let response = await steroid.verification();
        if (response){
            let user_id = sessionStorage.getItem('user_id');
            user_id = user_id.split("@");
            user_id[0] = user_id[0].replace(/./gi, "*");
            document.getElementById("username-data").innerText = user_id[0]+"@"+user_id[1];
            let ip = sessionStorage.getItem('user_ip');
            ip = ip.replace(/./gi, "*");
            document.getElementById("ip-data").innerText = ip;
            let wallpaper_token = sessionStorage.getItem('wallpaper_token');
            document.getElementById("wallpaper-token-input").value = wallpaper_token;
            let url = window.location.search;
            let splitted_url = url.split('?code=').pop();
            if (splitted_url !== ""){
                response = await steroid.spotify.request(splitted_url);
                if (response.refresh_token !== undefined){
                    response = await steroid.spotify.update(response.refresh_token);
                    displayNotification(response);
                    if (response.success){
                        document.getElementsByTagName("body")[0].style.pointerEvents = "none";
                        setTimeout(() => {window.location.href = "/dashboard.html";}, 4000);
                    }
                }
            }
            if (sessionStorage.getItem("spotify_token") !== null && sessionStorage.getItem("spotify_token") !== "null"){
                document.getElementById("connect-spotify-status").style.display = "flex";
            } else {
                document.getElementById("connect-spotify-button").style.display = "block";
            }
            if (sessionStorage.getItem("weather_api") !== "" && sessionStorage.getItem("weather_api") !== "null"){
                weatherAPIInput.value = sessionStorage.getItem("weather_api");
            }
            if (sessionStorage.getItem("user_location") !== "" && sessionStorage.getItem("user_location") !== "null"){
                weatherCityInput.value = sessionStorage.getItem("user_location");
            }
            document.getElementsByTagName("body")[0].style.display = "block";
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