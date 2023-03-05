window.onload = function(){

    const steroid = {
        url: 'https://steroidapp.ddns.net/',
        header: {'Content-Type': 'application/x-www-form-urlencoded'},
        errors: {
            offline: "Steroid is currently under maintenance for 24 hours, service will be restored after Sunday 05/03/2023 3:00AM UTC-03, sorry for the inconvenience."
        },
        verification: async function(response){
            if (sessionStorage.getItem("session_token") != null && sessionStorage.getItem("user_id") != null){
                try {
                    response = await fetch(steroid.url+"verification", {
                        method: "POST",
                        headers: steroid.header,
                        body: "user_id="+sessionStorage.getItem("user_id")+"&session_token="+sessionStorage.getItem("session_token"),
                    });
                    response.status = 200 ? response = true : response = false;
                } catch {
                    response = {error: steroid.errors.offline, code: 0}
                }
            }
            return response;
        },
        login: async function(user_id, password, response){
            try {
                await fetch(steroid.url+"login", {
                    method: "POST",
                    headers: steroid.header,
                    body: "user_id="+user_id+"&password="+password,
                }).then(res => {
                    switch(res.status){
                        case 200: response = res.json(); break;
                        case 401: response = {error: "", code: 401}; break;
                        case 429: response = {error: "Too many login attempts, wait a few minutes and try again.", code: 429}; break;
                    }
                }).catch(response = {error: steroid.errors.offline});
            } catch {
                response = {error: steroid.errors.offline, code: 0}
            }
            return response;
        },
        register: async function(user_id, password, response){
            await fetch(steroid.url+"register", {
                method: "POST",
                headers: steroid.header,
                body: "user_id="+user_id+"&password="+password,
            }).then(res => {
                switch(res.status){
                    case 200: response = res.json(); break;
                    case 401: response = {error: "", code: 401}; break;
                    case 429: response = {error: "Too many register attempts, come back in 24 hours.", code: 429}; break;
                }
            }).catch(response = {error: steroid.errors.offline, code: 0});
            return response;
        },
        recovery: async function(user_id){
            await fetch(steroid.url+"recovery", {
                method: "POST",
                headers: steroid.header,
                body: "user_id="+user_id,
            }).then(res => {
                switch(res.status){
                    case 200: response = {success: "If your account has been registered, you will recieve an email in just a few minutes."}; break;
                    case 401: response = {error: "", code: 401}; break;
                    case 429: response = {error: "Too many recovery attempts, come back in 24 hours.", code: 429}; break;
                }
            }).catch(response = {error: steroid.errors.offline, code: 0});
            return response;
        }
    }

    async function sessionCheck(){
        let response = await steroid.verification();
        if (response){
                window.location.replace("/dashboard.html");
        } else {
            document.getElementsByTagName("body")[0].style.display = "block";
        }
    }
    sessionCheck();

    //Nav bar
    const mobileButton = document.getElementById("navbar-burger");
    const nav = document.getElementById("navbarHome");

    // Main elements
    const welcomeContainer = document.getElementById("welcome-container");
    const loginButton = document.getElementById("login-button");
    const registerButton = document.getElementById("register-button");

    // Login - Register variable
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //Login elements
    const loginForm = document.getElementById("login-form");
    const emailLogin = document.getElementById("email-login");
    const passwordLogin = document.getElementById("password-login");
    const submitLogin = document.getElementById("submit-login-button");
    const forgotPassword = document.getElementById("forgot-password");

    // Forgot password elements
    const forgotForm = document.getElementById("forgot-form");
    const emailForgot = document.getElementById("email-forgot");

    // Register elements
    const registerForm = document.getElementById("register-form");
    const emailRegister = document.getElementById("email-register");
    const passwordRegister = document.getElementById("password-register");
    const passwordRepeat = document.getElementById("password-repeat");

    // Notification elements
    const notification = document.getElementById("notification");
    const notificationContainer = document.getElementById("notification-container");
    const notificationCloseButton = document.getElementById("notification-close-button");
    const notificationContent = document.getElementById("notification-content");
    const notificationHeader = document.getElementById("notification-header");
    const notificationText = document.getElementById("notification-text");
    
    // Event Listener Assignament
    loginButton.addEventListener("click", function(){
        if (nav.classList.contains("is-active")){
           nav.classList.toggle("is-active"); 
        }
        actionDisplay("welcome-login");
    });
    loginForm.addEventListener("submit", function(event){
        event.preventDefault();
        checkLoginSubmit();
    });

    forgotPassword.addEventListener("click", function(){actionDisplay("welcome-forgot")});
    forgotForm.addEventListener("submit", function(event){
        event.preventDefault();
        checkForgotSubmit();
    });

    registerButton.addEventListener("click", function(){
        if (nav.classList.contains("is-active")){
            nav.classList.toggle("is-active"); 
         }
        actionDisplay("welcome-register")
    });
    registerForm.addEventListener("submit", function(event){
        event.preventDefault();
        checkRegisterSubmit();
    });

    notificationCloseButton.addEventListener("click", function(){
        notification.style.display = "none";
        document.getElementsByTagName("body")[0].style.overflow = "";
    });
    
    function actionDisplay(id){
        document.getElementById("showcase-section").style.display = "none";
        document.getElementById("send-to-doc").style.display = "none";
        
        for (let i = 0; i < 5; i++){
            if (!welcomeContainer.children[i].classList.contains("is-hidden")){
                welcomeContainer.children[i].classList.remove("opacity-animation-display");
                setTimeout(function(){
                    welcomeContainer.children[i].classList.add("is-hidden");
                    document.getElementById(id).classList.remove("is-hidden");
                    setTimeout(function(){
                        document.getElementById(id).classList.add("opacity-animation-display");
                    },10)
                },200);
            }
        }
    }

    async function checkLoginSubmit(event) {
        if (emailPattern.test(emailLogin.value)){
            document.getElementById("email-login-check").classList.remove("is-hidden");
            emailLogin.classList.remove("is-danger");
            emailLogin.classList.add("is-success");
            document.getElementById("email-login-warning").classList.add("is-hidden");
            if (passwordLogin.value.length >= 8){
                document.getElementById("password-login-check").classList.remove("is-hidden");
                passwordLogin.classList.remove("is-danger");
                passwordLogin.classList.add("is-success");
                document.getElementById("password-login-warning").classList.add("is-hidden");
                submitLogin.classList.remove("is-danger");
                submitLogin.classList.add("is-loading");
                document.getElementById("login-request-warning").classList.add("is-hidden");
                document.getElementsByTagName("body")[0].style.pointerEvents = "none";
                let response = await steroid.login(emailLogin.value, passwordLogin.value);
                if (response.error !== undefined){
                    document.getElementById("email-login-check").classList.add("is-hidden");
                    emailLogin.classList.remove("is-success");
                    emailLogin.classList.add("is-danger");
                    document.getElementById("password-login-check").classList.add("is-hidden");
                    passwordLogin.classList.remove("is-success");
                    passwordLogin.classList.add("is-danger");
                    submitLogin.classList.remove("is-loading");
                    submitLogin.classList.add("is-danger");
                    document.getElementById("login-request-warning").classList.remove("is-hidden");
                    document.getElementsByTagName("body")[0].style.pointerEvents = "auto";
                    response.code !== 401 ? displayNotification(response) : false;
                } else {
                    document.getElementById("submit-login-button").classList.remove("is-loading");
                    sessionStorage.setItem("user_id", emailLogin.value);
                    sessionStorage.setItem("session_token", response.session_token);
                    sessionStorage.setItem("wallpaper_token", response.wallpaper_token);
                    sessionStorage.setItem("user_ip",response.user_ip);
                    sessionStorage.setItem("newsletter_topics",JSON.stringify(response.newsletter_topics));
                    sessionStorage.setItem("user_location",response.user_location);
                    sessionStorage.setItem("weather_api",response.weather_api);
                    sessionStorage.setItem("spotify_token",response.spotify_token);
                    window.location.replace("/dashboard.html");
                }
            } else {
                document.getElementById("password-login-check").classList.add("is-hidden");
                passwordLogin.classList.add("is-danger");
                document.getElementById("password-login-warning").classList.remove("is-hidden");
            }
        } else {
            document.getElementById("email-login-check").classList.add("is-hidden");
            emailLogin.classList.add("is-danger");
            document.getElementById("email-login-warning").classList.remove("is-hidden");
        }
    }

    async function checkForgotSubmit(event){
        if (emailPattern.test(emailForgot.value)){
            document.getElementById("email-forgot-check").classList.remove("is-hidden");
            emailForgot.classList.remove("is-danger");
            emailForgot.classList.add("is-success");
            document.getElementById("email-forgot-warning").classList.add("is-hidden");
            document.getElementById("submit-forgot-button").classList.add("is-loading");
            document.getElementsByTagName("body")[0].style.pointerEvents = "none";
            let response = await steroid.recovery(emailForgot.value);
            if (response.error !== undefined){
                emailForgot.classList.remove("is-success");
                emailForgot.classList.add("is-danger");
                document.getElementById("email-forgot-check").classList.add("is-hidden");
                document.getElementById("email-forgot-warning").classList.remove("is-hidden");
                document.getElementById("submit-forgot-button").classList.remove("is-loading");
                document.getElementsByTagName("body")[0].style.pointerEvents = "auto";
                response.code !== 401 ? displayNotification(response) : false;
            } else {
                document.getElementById("submit-forgot-button").classList.replace("is-danger","is-success");
                document.getElementById("submit-forgot-button").classList.remove("is-loading");
                document.getElementsByTagName("body")[0].style.pointerEvents = "auto";
                displayNotification(response);
            }
        } else {
            emailForgot.classList.remove("is-success");
            emailForgot.classList.add("is-danger");
            document.getElementById("email-forgot-check").classList.add("is-hidden");
            document.getElementById("email-forgot-warning").classList.remove("is-hidden");
            document.getElementById("submit-forgot-button").classList.remove("is-loading");
            document.getElementsByTagName("body")[0].style.pointerEvents = "auto";
            displayNotification(response);
        }
    }

    async function checkRegisterSubmit(event) {
        if (emailPattern.test(emailRegister.value)){
            document.getElementById("email-register-check").classList.remove("is-hidden");
            emailRegister.classList.remove("is-danger");
            emailRegister.classList.add("is-success");
            document.getElementById("email-register-warning").classList.add("is-hidden");
            if (passwordRegister.value.length >= 8){
                document.getElementById("password-register-check").classList.remove("is-hidden");
                passwordRegister.classList.remove("is-danger");
                passwordRegister.classList.add("is-success");
                document.getElementById("password-register-warning").classList.add("is-hidden");
                if (passwordRepeat.value === passwordRegister.value){
                    document.getElementById("password-repeat-check").classList.remove("is-hidden");
                    passwordRepeat.classList.remove("is-danger");
                    passwordRepeat.classList.add("is-success");
                    document.getElementById("password-repeat-warning").classList.add("is-hidden");
                    document.getElementById("submit-register-button").classList.add("is-loading");
                    document.getElementsByTagName("body")[0].style.pointerEvents = "none";
                    let response = await steroid.register(emailRegister.value, passwordRegister.value);
                    if (response.error !== undefined){
                        document.getElementById("email-register-check").classList.add("is-hidden");
                        emailRegister.classList.remove("is-success");
                        emailRegister.classList.add("is-danger");
                        document.getElementById("email-register-warning").classList.remove("is-hidden");
                        document.getElementById("submit-register-button").classList.remove("is-loading");
                        document.getElementById("submit-register-button").classList.add("is-danger");
                        document.getElementsByTagName("body")[0].style.pointerEvents = "auto";
                        response.code !== 200 ? displayNotification(response) : false;
                    } else {
                        document.getElementById("submit-register-button").classList.remove("is-loading");
                        sessionStorage.setItem("user_id", emailRegister.value);
                        sessionStorage.setItem("session_token", response.session_token);
                        sessionStorage.setItem("user_ip",response.user_ip);
                        sessionStorage.setItem("newsletter_topics",JSON.stringify(response.newsletter_topics));
                        sessionStorage.setItem("user_location",response.user_location);
                        sessionStorage.setItem("weather_api",response.weather_api);
                        sessionStorage.setItem("spotify_token",response.spotify_token);
                        sessionStorage.setItem("wallpaper_token", response.wallpaper_token);
                        window.location.replace("/dashboard.html");
                    }
                } else {
                    document.getElementById("password-repeat-check").classList.add("is-hidden");
                    passwordRepeat.classList.add("is-danger");
                    document.getElementById("password-repeat-warning").classList.remove("is-hidden");
                }
            } else {
                document.getElementById("password-register-check").classList.add("is-hidden");
                passwordRegister.classList.add("is-danger");
                document.getElementById("password-register-warning").classList.remove("is-hidden");
            }
        } else {
            document.getElementById("email-register-check").classList.add("is-hidden");
            emailRegister.classList.add("is-danger");
            document.getElementById("email-register-warning").classList.remove("is-hidden");
        }
    }

    function displayNotification(text){
        if (text.error !== undefined){
            if (text.error.error_description != undefined){
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

    switch(window.location.hash){
        case '#login':
            actionDisplay("welcome-login");
            break;
        case '#register':
            actionDisplay("welcome-register");
            break;
        case '#recovery':
            actionDisplay("welcome-forgot");
            break;
        default:
            break;
    }
}
