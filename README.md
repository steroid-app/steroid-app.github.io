# Steroid, Wallpaper Engine web extension.

## ⚠️ Warning:
STEROID IS STILL ON DEVELOPMENT, AND IT WON'T BE COMPLETELY PUBLISHED UNTIL A COMPLETE AND FULLY FUNCTIONAL ALPHA VERSION IS PRESENTED. FOR NOW, ONLY WEATHER AND SPOTIFY FEATURES WILL BE ONLINE FOR TESTING PURPOSES.

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
      - [Saving your Location and Token.](#saving-your-location-and-token)
      - [Current Weather.](#current-weather)
      - [Forecast.](#forecast-weather)
    - [Spotify.](#spotify-api)
      - [Credential Exchange.](#credential-exchange)
      - [Token Refresh.](#token-refresh)
      - [Playback Information.](#playback-information)
    - [News.](#news-api)
  - [Steroid Desktop App.](#steroid-desktop-app)
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
    <script src="steroid.js"></script> <!-- LIKE THIS -->
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
- Error handling is on your own, there won't be a premade error handling functions. This is because we only provide a library to work with and simplify your users interaction.

#

## **Server status:**
Calling our API and knowing Steroid's status is as simply as this:
```javascript
  let hello = await steroid.hello(); // Call Steroid API to request server status.
```
This call will return a simple boolean: 
```javascript
true / false
```
This response will give you and idea if the service is running or not. If you don't recieve a response, it means our server is temporarily offline or under maintenance.

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

> You can check the AccuWeather API Documentation by clicking: **[here](https://developer.accuweather.com/apis)**.

##

### **Weather API check:**
Weather check function takes care of all the steps needed to check if you logged into your Steroid account.

```javascript
var check = await steroid.weather.check();
```
**And it's response should be:**
```json
response: {
    success: true
}
```

#

### **Current Weather:**
Requests current weather information around your location.
```javascript
let current_weather = await steroid.weather.current();
```

> You must have already saved your location and API token on Steroid's webpage.
> By default, this function will prevent you from calling it in less than an hour.

#

### **Forecast Weather:**
Requests an extense weather forecast of your current location.
```javascript
let forecast_weather = await steroid.weather.forecast();
```

> You must have already saved your location and API token on Steroid's webpage.
> By default, Steroid will request a weather forecast of 5 days, and only twice per day.

#

## Spotify API

Steroid connects directly to Spotify, working with it's API and retrieving everything the user needs with each call. This method requires you to be logged in with your account to store your **`refresh_token`**.

##

### **Spotify API check:**
Spotify check function takes care of all the steps needed to check if you logged into your Steroid account.

```javascript
var check = await steroid.spotify.check();
```
**And it's response should be:**
```json
response: {
    success: true
}
```

### **Token Refresh:**
Now, with your credentials exchange already made in Steroid's Dashboard, your Spotify **`refresh_token`** will be stored in our server. This special token can be used to request something called **`access_token`** that allows users to request information from Spotify's servers, and this fuction requests it for you.

```javascript
var new_access_token = await steroid.spotify.refresh();
```

**And by doing so, we should get this response:**
```json
response: {
    success: true
}
```
Now we can use our brand new **`access_token`** to request data from Spotify servers whenever we want.

#

### **Playback Information:**
With this function, you will be able to request playback details, information and current playing song.

```javascript
  var playback_information = await steroid.spotify.playback();
```

**Returning this when a new song shows up:**
```json
  {
    song: {
        name: "song_name",
        album: "album_title",
        artist: "artist_name",
        cover: {
            url: "cover_image_url",
            base64: "Base64 cover image"
        },
        duration: {
            ms: 99999999999, // Song duration in miliseconds
            time: "99:99" // Song duration in minutes:seconds format
        },
        progress: {
            ms: 000000000, // Song progress in miliseconds
            time: "00:00" // Song progress in minutes:seconds format
        }
    }
  }
```

**And it will continue to output just the progress until the song changes:**
```json
  {
    progress: {
        ms: 000000000, // Song progress in miliseconds
        time: "00:00" // Song progress in minutes:seconds format
    }
  }
```

If you don't need or want to process your song duration and progress into **`minutes:seconds`** format, you can easily turn it off by doing this:

```javascript
  steroid.spotify.spotify.options.process_timeStamp = false;
```
> **Note:** Keep in mind that by turning off **`process_timeStamp`**, you will be saving up some resources in low-end computers.

If you don't want to output any progress whatsoever, you can actually disable the progress output and wait for a new song:

```javascript
  steroid.spotify.spotify.options.progress = false;
```
**And you should get this in return:**
```json
  {
      is_playing: true
  }
```
> **Note:** Keep in mind that by turning off **`progress`**, you will be saving up a lot of resources in low-end computers.

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

## Credits
Steroid is heavily inspired on **[Rainmeter](https://www.rainmeter.net/)**, as an effort to provide a native-like service and experience for **[Wallpaper Engine](https://www.wallpaperengine.io)** users who would like to stay on the JavaScript side of the moon.

## License
[CC BY NC SA 4.0](LICENSE)