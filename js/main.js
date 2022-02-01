"use strict";
import {
    searchForm,
    nowWindow,
    detailsWindow,
    forecastWindow,
    changeInfoBtns,
    locationList,
    favoriteCityTemplate
} from "./view.js";
import {storage} from "./storage.js";
import {format} from 'date-fns';

const MAX_FAVORITE_CITIES_NUMBER = 7;


function getLocalTime(timeInSeconds, timezoneOffset) {
    const queryDate = new Date(timeInSeconds * 1000);
    timezoneOffset *= 1000;

    const ipDate = new Date();
    const ipTimezoneOffset = -ipDate.getTimezoneOffset() * 60000;

    const timezoneDifference = timezoneOffset - ipTimezoneOffset;

    return new Date(queryDate.getTime() + timezoneDifference);
}

function fillNowWindow({main: {temp}}, cityName) {
    nowWindow.temp.textContent = Math.round(temp) + "°";
    nowWindow.cityName.textContent = cityName;
    makeCorrectFavoriteStatus();
}

function fillDetailsWindow({
                               main: {temp, feels_like},
                               weather: [{main: weather}],
                               timezone,
                               sys: {sunrise, sunset}
                           }, cityName) {

    detailsWindow.cityName.textContent = cityName;
    detailsWindow.temperature.textContent = "Temperature: " + Math.round(temp) + "°";
    detailsWindow.feeling.textContent = "Feels like: " + Math.round(feels_like) + "°";
    detailsWindow.weather.textContent = "Weather: " + weather;

    const timezoneOffset = timezone;
    const sunriseDate = getLocalTime(sunrise, timezoneOffset);
    const sunsetDate = getLocalTime(sunset, timezoneOffset);

    detailsWindow.sunrise.textContent = "Sunrise: " + format(sunriseDate, 'HH:mm');
    detailsWindow.sunset.textContent = "Sunset: " + format(sunsetDate, 'HH:mm');
}

function fillForecastWindow({list: forecastList}, cityName) {
    forecastWindow.cityName.textContent = cityName;

    forecastWindow.resetForecastItems();
    for (let forecastItem of forecastList) {
        forecastWindow.createForecastItem(forecastItem);
    }
}

function fetchErrorHandler(error) {
    if (error.name === "TypeError") {
        alert("Invalid URL or internet is absent");
    } else if (error.name === "Error") {
        alert(error.message);
    } else {
        throw error;
    }
}

function findWeather(cityName) {
    const serverUrl = 'http://api.openweathermap.org/data/2.5/';
    const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';

    const currentWeatherUrl = `${serverUrl}weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const forecastUrl = `${serverUrl}forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    searchForm.cityName.value = "";


    async function weatherQuery() {
        let response = await fetch(currentWeatherUrl);
        let data = await response.json();

        if (data.cod !== 200) throw new Error(data.message);

        fillNowWindow(data, cityName);
        fillDetailsWindow(data, cityName);
        storage.saveCurrentCity(cityName);
    }

    async function forecastQuery() {
        let response = await fetch(forecastUrl);
        let data = await response.json();

        if (Number(data.cod) !== 200) throw new Error(data.message);

        fillForecastWindow(data, cityName);
    }

    weatherQuery().catch(fetchErrorHandler);
    forecastQuery().catch(fetchErrorHandler);
}

function makeCorrectFavoriteStatus() {
    let cityName = nowWindow.cityName.textContent;
    if (favoriteCities.includes(cityName) && nowWindow.addFavoriteBtn.classList.contains("city-info__add-favorite_not-added") ||
        (!favoriteCities.includes(cityName) && nowWindow.addFavoriteBtn.classList.contains("city-info__add-favorite_added"))) {
        changeFavoriteStatus();
    }
}

function changeFavoriteStatus() {
    nowWindow.addFavoriteBtn.classList.toggle("city-info__add-favorite_not-added");
    nowWindow.addFavoriteBtn.classList.toggle("city-info__add-favorite_added");
}

function addCityToFavorite(cityName) {
    let newCityElem = favoriteCityTemplate.cloneNode(true);
    let cityNameElem = newCityElem.querySelector(".location__city-name");
    cityNameElem.textContent = cityName;

    locationList.append(newCityElem);
    addFavoriteCityEventListeners(newCityElem);

    changeFavoriteStatus();
}

function deleteCityFromFavorite(cityName) {
    storage.deleteFavoriteCity(cityName);

    let cityElements = locationList.querySelectorAll("li");
    for (let cityElement of cityElements) {
        let cityNameElement = cityElement.querySelector(".location__city-name");
        if (cityNameElement.textContent === cityName) {
            cityElement.remove();
            break;
        }
    }

    if (nowWindow.cityName.textContent === cityName) {
        changeFavoriteStatus();
    }
}

function addFavoriteCityEventListeners(cityElem) {
    let cityNameElem = cityElem.querySelector(".location__city-name");
    let cityName = cityNameElem.textContent;
    cityNameElem.addEventListener("click", () => findWeather(cityName));

    let deleteBtn = cityElem.querySelector(".location__delete-btn");
    deleteBtn.addEventListener("click", () => deleteCityFromFavorite(cityName));
}

function showFavoriteCities(cities) {
    for (let city of cities) {
        addCityToFavorite(city);
    }
}

function addFavoriteHandler(cityName) {
    const favoriteCities = storage.getFavoriteCities();
    const favoriteCitiesNumber = storage.favoriteCities.length;
    if (!favoriteCities.includes(cityName)) {
        if (favoriteCitiesNumber < MAX_FAVORITE_CITIES_NUMBER) {
            storage.addFavoriteCity(cityName);
            addCityToFavorite(cityName);
        } else {
            alert(`Max favorite cities number is ${MAX_FAVORITE_CITIES_NUMBER}`);
        }
    } else {
        deleteCityFromFavorite(cityName);
    }
}


let favoriteCities = storage.getFavoriteCities();
let currentCity = storage.getCurrentCity() || "Tomsk";
let currentWindow = nowWindow;
let currentBtn = changeInfoBtns.now;

showFavoriteCities(favoriteCities);
findWeather(currentCity);


function changeWindow(newBtn, newWindow) {
    currentBtn.classList.toggle("change-info__btn_active");
    newBtn.classList.toggle("change-info__btn_active");
    currentBtn = newBtn;

    currentWindow.changeStatus();
    newWindow.changeStatus();
    currentWindow = newWindow;
}


searchForm.submitForm.addEventListener("submit", () => findWeather(searchForm.cityName.value));
changeInfoBtns.now.addEventListener("click", () => {
    changeWindow(changeInfoBtns.now, nowWindow);
})
changeInfoBtns.details.addEventListener("click", () => {
    changeWindow(changeInfoBtns.details, detailsWindow);
})
changeInfoBtns.forecast.addEventListener("click", () => {
    changeWindow(changeInfoBtns.forecast, forecastWindow);
})


nowWindow.addFavoriteBtn.addEventListener("click", () => {
    addFavoriteHandler(nowWindow.cityName.textContent);
})