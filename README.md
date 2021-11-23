# Steroid, Wallpaper Engine web extension.

## ⚠️ Warning:
STEROID IS STILL ON DEVELOPMENT, ONLY ALPHA TESTING HAS BEEN RELEASED.

## What is Steroid
Steroid is a simple web app, that packs all the necessary features to create your own awesome wallpapers and share them with the world, adding new functionalities to Wallpaper Engine and it's own features to the table; creating a hybrid between native and web support.

## What is it made of
Steroid web app uses a number of open source projects and code of our own to work properly:

- [Electron](https://github.com/electron/electron) - Framework to create cross-platform desktop applications using Javascript, CSS and HTML.
- [Electron Packager](https://github.com/electron/electron-packager) - Electron app packager.
- [Node.js](https://github.com/nodejs/node) - Evented I/O.
- [Express](https://github.com/expressjs/express) - Fast Node.js network app framework.
- [Powershell](https://github.com/powershell/powershell) - Command line shell.

## Table of Contents
  - [Features.](#features)
  - [To-do.](#to-do)
  - [Download.](#download)
  - [Installation.](#installation)
    - [Browser.](#browser)
    - [Executable.](#executable)
  - [Steroid API.](#steroid-api)
    - [Introduction.](#steroid-api)
    - [Server Status.](#server-status)
    - [Authentification](#authentification)
      - [Login.](#login-with-your-account)
      - [Verification.](#account-verification)
    - [Weather.](#weather-api)
      - [Settings and Customization.](#settings-and-customization)
      - [Current Conditions.](#current-conditions)
      - [Forecast Information.](#forecast-information)
      - [City Code.](#city-code)
      - [Timer Reset.](#timer-reset)
      - [Set Forecast Days.](#set-forecast-days)
      - [Weather Icons.](#weather-conditions-icons)
    - [Spotify.](#spotify-api)
      - [Settings and Cache.](#spotify-settings-and-cache)
      - [Login.](#login-with-spotify)
      - [Playback information.](#playback-information)
      - [Modify playback state.](#modify-playback-state)
    - [News.](#news-api)
  - [Steroid Desktop App.](#steroid-desktop-app)
  - [Tutorials.](#tutorials)
    - [Spotify Setup.](#spotify-setup)
    - [Weather Setup.](#weather-setup)
  - [Credits](#credits)
  - [License](#license)

#

## Features
- [x] Get access to Spotify content easily.
- [x] Weather Forecast.
- [x] Computer metrics.
- [x] Foreing program execution.
- [x] Cloud settings and backup.
- [ ] *News and topics from all over the world*.

#

## To-do
- [ ] Newsletter page.
- [ ] News and topics reader.
- [ ] Performance tweaks.
- [ ] Desktop App release.

#

## Download

> **Steroid is on alpha stage, and it's not ready to be released to the public yet.
> If you want to be part of the alpha testing community, you can do so by sending an email at:**
>
> steroid@outlook.com.ar
#

## Installation
**You have two installation methods**:
- Via Browser.
- Native app (Executable).

#### Browser:
Steroid's browser version only requires a simple JS file, called **`steroid.js`**. This file contains everything you need to communicate with our server and request data.

- > Download link will be added soon after alpha testing.
- Add it to your HTML head section, just like this:
  ```html
  <head>
    <...> Other stuff </...>
    <script src="steroid-core.js"></script> <!-- LIKE THIS -->
    <script src="your_script_here.js"></script>
  </head>
  ```
- Done.

**You should keep in mind that this version doesn't have:**
- Computer metrics.
- Foreing program execution.

> Steroid doesn't require any type of extension or framework, it's just a simple standalone library file. Keep in mind that it only works on your localhost domain, thanks to our CORS policy.

#### Executable:
- > Download link will be added soon after alpha testing.
- Execute **`"Steroid-Setup-x64.exe"`**.
- Read our ToS.
- Allow Steroid to open on Startup.
- Done, Steroid will be installed on your PC.

> Steroid is going to start on tray and remain waiting on the background, where you can close it if you want to.

#

## Steroid API

### **Introduction**

Steroid API bases on the KISS Principle *(Keep it simple, stupid)*.
There is no need to create complex functions or return a massive amount of data just to, for example, display CPU usage information. But, since Steroid contains a good amount of different API calls, you must read this guide first.

**Functions:**
- At the moment, Steroid is only running a few functions, and this is because it's still on development. With each update, this section will be populated, and all of our users will be notified as soon as a new version comes out.

    > Keep in mind that Steroid's API functions are asynchronous. You can check how they work by clicking **[here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)**.

**Authentification:**
- Steroid runs on HTTPS and will return a token to your browser, don't share your token or login on pages that aren't Steroid's github site.

**Request Limit:**
- Request limits are needed. First for user safety, and second to avoid bottlenecks in our server. Remember that this project is still on development, and some functions are still experimental. This is why, you must think how are you going to implement and develop your wallpaper.

**Error handling:**
- Every function will return an error if something didn't work correctly:
```javascript
  {error: "This is an error"}
```

#

## **Server status:**
Calling our API and knowing Steroid's status is as simply as this:
```javascript
  let hello = await steroid.hello(); // Call Steroid API to request server status.
```
This call will return a simple boolean: 
```javascript
{ success: true }
```
This response will give you and idea if the service is running or not.

After this, you must login with your account.

#

## Authentication

### **Account verification:**
You don't have to constantly keep logging in with your password each time you install a wallpaper, that's why there is a **`wallpaper_token`**. By calling **`steroid.verification()`**, Steroid will automatically exchange your **`wallpaper_token`** and **`user_id`** for you, to return new changes made in your account.
```javascript
let login_response = await steroid.verification();
```
**A normal response should be:**
```json
response: {
    "user_ip": "192.168.1.1", // Your IP Address
    "user_location": "City, State, Country", // Your location
    "spotify_token":"AQDoLvTCZeSHhNlTPoc...", // Spotify API refresh token
    "weather_api":"5Hs9Ys...", // AccuWeather API key
}
```

#

## Weather API

Steroid's Weather API works directly with **[AccuWeather API](https://developer.accuweather.com)**, calling it's server and requesting all the information you need, whenever you want. By doing so, your requests won't have any hard limits, and aren't tied to our server.

Steroid's Weather Forecast is super simple and easy to use. It has been implemented like this so you don't have to worry about forgetting your AccuWeather API token. We can store them in our server and it will be applied on any wallpaper you have that runs on Steroid.

It's highly customizable and easy to work with, you can access to it's memory, settings and cache to retrieve data or modify anything you would need.

> You can check the AccuWeather API Documentation by clicking: **[here](https://developer.accuweather.com/apis)**.

##

### **Settings and customization:**
First of all, you have multiple settings to customize for your own project:
```javascript
settings: {
    active: true, // If you want to keep in memory if it's turned on or not.
    current: true, // If you want to active your current weather
    forecast: true, // If you want to activate your forecast
    forecast_days: 3, // Days of forecast (Max 5)
    convention: "Metric", // Metric / Fahrenheit
    waitingTime: { // Both in ms
        current: 3600000, // One hour
        forecast: 14400000 // Four hours
    }
}
```
All the settings mentioned previously can be edited like this:
```javascript
steroid.weather.settings.active = false;
steroid.weather.settings.forecast_days = 5;
```
And the changes will apply the next time you run or execute the weather function.
You can use this variables for your own project without any fear of breaking the code.
For example, let's say you want to have a variable where you want to store if the weather is active or not, well, you can use **`steroid.weather.settings.active`** for that.

##

#### **Current conditions:**
Requests current weather information around your location.
```javascript
let current_weather = await steroid.weather.current();
```

> You must have already saved your location and API token on Steroid's webpage.
> By default, this function will prevent you from calling it in less than an hour.

##

#### **Forecast information:**
Requests an extense weather forecast of your current location.
```javascript
let forecast_weather = await steroid.weather.forecast();
```

> You must have already saved your location and API token on Steroid's webpage.
> By default, Steroid will request a weather forecast of 3 days, and it will prevent you from calling it in less than four hours.

##

#### **City code:**
```javascript
let city_code_change = await steroid.weather.cityCode();
```
This function stores your city code in your **`localStorage`**, and return:
```javascript
{success: true}
```
Only when the code has been saved.

> You must have already saved your location and API token on Steroid's webpage.

##

#### **Timer reset:**
This function will reset steroid's internal timer, to allow you to request new weather details. It will simply return a **`true/false`** response.
```javascript
let timer_reset = await steroid.weather.timerReset();
```

##

#### **Set forecast days:**
This function will change steroid's forecast limit. It will simply return a **`true/false`** response.
```javascript
let timer_reset = await steroid.weather.setForecastDays(days);
```

##

#### **Weather condition icons:**
Accessing to this variable will give you all the icon codes and names used by AccuWeather.
```javascript
let icons = steroid.weather.icons;
let rain_icon = steroid.weather.icons[18];
```

#

## Spotify API

To use it, you must first sign in your account, linking Steroid with Spotify in the Dashboard. This way, your **`refresh_token`** will be stored in our server, and you won't have to follow an overcomplicated process.

This special token, can be used to request something called **`access_token`**, that is being used by different users to request information from Spotify's servers, modify your playback state and get it's status.

Steroid connects directly to Spotify, working with it's API and retrieving everything the user needs with each call. This method requires you to be logged in with your account to store your **`refresh_token`** and other variables.

> It's highly recommended to login with Steroid's account first, and then login with Spotify to use all the needed functions.

##

#### **Spotify settings and cache:**

It's highly recommended to use this settings and test them on different environments:
```javascript
settings: {
    active: true, // If you want to keep track of Spotify activation status (Same as weather)
    progress: true, // Output progress or not
    create_cover: true, // Create a base64 cover to output on song change
    process_timeStamp: true // Process timestamp to mm:ss
}
```
If you have been reading this guide, it means that you already know how to activate/deactivate this functions. In any case you didn't, you can do it by:
```javascript
steroid.spotify.settings.active = false;
steroid.spotify.settings.progress = false;
```
And, if you want to access it's cache memory for any desired reason, you can do so by:
```javascript
let spotify_cache = steroid.spotify.cache;
```
##

#### **Login with Spotify:**
To login with Spotify and get all the needed tokens to use it, you must access by calling this function:
```javascript
let spotify_login = await steroid.spotify.access();
```
And as response, you should get:
```javascript
{success: true}
```

##

#### **Playback information:**
Get all the playback information needed by calling:
```javascript
var playback_info = await steroid.spotify.playback();
```
```json
{
    "song": {
        "name": "Differently",
        "album": "Differently",
        "artist": "Marin Hoxha",
        "cover": {
            "url": "https://i.scdn.co/image/ab67616d00001e02723ec05ad325de4ce3d034b3",
            "base64": "data:image/png;base64, ..."
        },
        "duration": {
            "ms": 183350,
            "time": "3:03"
        },
        "progress": {
            "ms": 0,
            "time": 0
        }
    }
}
```
And when the song continues, instead of sending everything again, it will send you the progress:
```json
"progress": {
    "ms": 0,
    "time": 0
}
```

**If you don't need or want to process your song duration and progress into **`minutes:seconds`** format, you can easily turn it off by doing this:**

```javascript
  steroid.spotify.settings.process_timeStamp = false;
```
> **Note:** Keep in mind that by turning off **`process_timeStamp`**, you will be saving up some resources in low-end computers.

**If you don't want to output any progress whatsoever, you can actually disable the progress output and wait for a new song:**

```javascript
  steroid.spotify.settings.progress = false;
```
**And you should get one of these in return:**
```json
{play: true}, // If the song is reproducing now
{pause: true}, // If the song has been paused
{stopped: true} // If Spotify has been stopped completely

```
> **Note:** Keep in mind that by turning off **`progress`**, you will be saving up a lot of resources in low-end computers.

##

#### **Modify playback state:**

**Play:**
> Coming in the next update
####
**Pause:**
> Coming in the next update
####
**Stop:**
> Coming in the next update
####
**Next:**
> Coming in the next update
####
**Previous:**
> Coming in the next update
####
**Get collection:**
> Coming in the next update
####

#

## News API

> For now this function isn't available, but it will be when finished.

#

## Steroid Desktop App

### Introduction
Steroid's desktop application gives limited 'native' support over API communication to your web application.
This means that your frontend will recieve metrics, details of your computer, execute programs and their *(if that's the case)* responses.

This application will stay running on the background, waiting to be called since your PC boot. So you can connect it to different setups if you want to, or different types of programs. That's your choice.

#

### Desktop App Usage

> For now this function isn't available, but it will be when finished.

#

## Tutorials

### Spotify Setup

- First, you have to access Steroid's Dashboard, by clicking [here](https://steroid-app.github.io/#login).
- Then, click on "Connect" next to "Spotify" on the integration panel.
- Login with Spotify.

[*] Done! Spotify has been linked to your account, and should look like this now:

[previewicon=25513858;sizeThumb,inline;sr6.png][/previewicon]

[*] And turn on "[b]Spotify[/b]" now.

[previewicon=25565778;sizeThumb,inline;sr8.png][/previewicon]

[*] Now, you must activate "[b]Online Features[/b]".

[previewicon=25514320;sizeThumb,inline;sr7.png][/previewicon]

[*] Done, spotify activated!


#

## Credits
Steroid is heavily inspired on **[Rainmeter](https://www.rainmeter.net/)**, as an effort to provide a native-like service and experience for **[Wallpaper Engine](https://www.wallpaperengine.io)** users who would like to stay on the JavaScript side of the moon.

## License
[CC BY NC SA 4.0](LICENSE)