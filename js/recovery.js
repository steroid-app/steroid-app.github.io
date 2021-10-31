window.onload = function(){

    const url = window.location.search;
    const ticket = url.split('?ticket=').pop();
    ticket == "" ? window.location.replace("/") : false;

    const steroid = {
        // CORE VARIABLES
        url: 'https://steroidapp.ddns.net/',
        header: {'Content-Type': 'application/x-www-form-urlencoded'},
        errors: {
            offline: "Ooops, seems like Steroid's server is offline or under maintenance! Come back in a few minutes."
        },
        recovery: async function(user_id, password, ticket, response){
            await fetch(steroid.url+"recovery", {
                method: "POST",
                headers: steroid.header,
                body: "user_id="+user_id+"&password="+password+"&ticket="+ticket,
            }).then(res => {
                console.log(res);
                switch(res.status){
                    case 200: response = {success: "Your password has been changed."}; break;
                    case 401: response = {error: "Email invalid, try again.", code: 401}; break;
                    case 429: response = {error: "Too many token refresh attempts, come back in 24 hours.", code: 429}; break;
                    case 500: response = {error: "Internal server error, please contact with technical support.", code: 500}; break;
                }
            }).catch(response = {error: steroid.errors.offline});
            return response;
        },
    }

    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //Nav bar
    const mobileButton = document.getElementById("navbar-burger");
    const nav = document.getElementById("navbarHome");


    // Recovery elements
    const recoveryForm = document.getElementById("recovery-form");
    const emailRecovery = document.getElementById("email-recovery");
    const passwordRecovery = document.getElementById("password-recovery");
    const passwordRepeat = document.getElementById("password-repeat");

    // Notification elements
    const notification = document.getElementById("notification");
    const notificationContainer = document.getElementById("notification-container");
    const notificationCloseButton = document.getElementById("notification-close-button");
    const notificationContent = document.getElementById("notofication-content");
    const notificationHeader = document.getElementById("notification-header");
    const notificationText = document.getElementById("notification-text");

    // Event Listener Assignament
    mobileButton.addEventListener("click", function(){
        nav.classList.toggle("is-active");
    });

    recoveryForm.addEventListener("submit", function(event){
        event.preventDefault();
        checkRecoverySubmit();
    });

    notificationCloseButton.addEventListener("click", function(){
        notification.style.display = "none";
        document.getElementsByTagName("body")[0].style.overflow = "";
    });

    async function checkRecoverySubmit(event) {
        if (emailPattern.test(emailRecovery.value)){
            document.getElementById("email-recovery-check").classList.remove("is-hidden");
            emailRecovery.classList.remove("is-danger");
            emailRecovery.classList.add("is-success");
            document.getElementById("email-recovery-warning").classList.add("is-hidden");
            if (passwordRecovery.value.length >= 8){
                document.getElementById("password-recovery-check").classList.remove("is-hidden");
                passwordRecovery.classList.remove("is-danger");
                passwordRecovery.classList.add("is-success");
                document.getElementById("password-recovery-warning").classList.add("is-hidden");
                if (passwordRepeat.value === passwordRecovery.value){
                    document.getElementById("password-repeat-check").classList.remove("is-hidden");
                    passwordRepeat.classList.remove("is-danger");
                    passwordRepeat.classList.add("is-success");
                    document.getElementById("password-repeat-warning").classList.add("is-hidden");
                    document.getElementById("submit-recovery-button").classList.add("is-loading");
                    document.getElementsByTagName("body")[0].style.pointerEvents = "none";
                    let response = await steroid.recovery(emailRecovery.value, passwordRecovery.value, ticket);
                    if (response.error !== undefined){
                        document.getElementById("email-recovery-check").classList.add("is-hidden");
                        emailRecovery.classList.remove("is-success");
                        emailRecovery.classList.add("is-danger");
                        document.getElementById("email-recovery-warning").classList.remove("is-hidden");
                        document.getElementById("submit-recovery-button").classList.remove("is-loading");
                        document.getElementById("submit-recovery-button").classList.add("is-danger");
                        document.getElementsByTagName("body")[0].style.pointerEvents = "auto";
                        response.code !== 401 ? displayNotification(response) : false;
                    } else {
                        document.getElementsByTagName("body")[0].style.pointerEvents = "auto";
                        document.getElementById("submit-recovery-button").classList.remove("is-loading");
                        document.getElementById("submit-recovery-button").classList.replace("is-danger", "is-success");
                        displayNotification(response);
                    }
                } else {
                    document.getElementById("password-repeat-check").classList.add("is-hidden");
                    passwordRepeat.classList.add("is-danger");
                    document.getElementById("password-repeat-warning").classList.remove("is-hidden");
                }
            } else {
                document.getElementById("password-recovery-check").classList.add("is-hidden");
                passwordRecovery.classList.add("is-danger");
                document.getElementById("password-recovery-warning").classList.remove("is-hidden");
            }
        } else {
            document.getElementById("email-recovery-check").classList.add("is-hidden");
            emailRecovery.classList.add("is-danger");
            document.getElementById("email-recovery-warning").classList.remove("is-hidden");
        }
    }

    function displayNotification(text){
        if (text.error != undefined){
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
};
