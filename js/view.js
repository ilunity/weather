"use strict";
const searchForm = {
    cityName: document.querySelector(".search__city"),
    submitForm: document.querySelector(".search__form")
}

const nowWindow = {
    temp: document.querySelector(".now-window__temperature"),
    image: document.querySelector(".now-window__weather-icon img"),
    cityName: document.querySelector(".now-window__city-info .city-info__title"),
    addFavoriteBtn: document.querySelector(".now-window__city-info .city-info__add-favorite")
}
nowWindow.changeStatus = function () {
    let windowElem = document.querySelector(".now-window");
    windowElem.classList.toggle("info__window_active");
};

const detailsWindow = {
    cityName: document.querySelector(".details-window__city-name"),
    temperature: document.querySelector(".details-window__temperature"),
    feeling: document.querySelector(".details-window__feeling"),
    weather: document.querySelector(".details-window__weather"),
    sunrise: document.querySelector(".details-window__sunrise"),
    sunset: document.querySelector(".details-window__sunset")
}
detailsWindow.changeStatus = function () {
    let windowElem = document.querySelector(".details-window");
    windowElem.classList.toggle("info__window_active");
}

const forecastWindow = {
    cityName: document.querySelector(".forecast-window__city-name"),
    forecastList: document.querySelector(".forecast-window__list")
}
forecastWindow.changeStatus = function () {
    let windowElem = document.querySelector(".forecast-window");
    windowElem.classList.toggle("info__window_active");
}
forecastWindow.createForecastItem = function(data) {
    const forecastItem = document.createElement('li');
    forecastItem.className = 'forecast-window__item forecast-item';

    const date = new Date(data.dt * 1000);
    forecastItem.innerHTML = `<div class="forecast-item__date">
                                      <div class="forecast-item__day">${date.getDate()} ${getStringMonth(date.getMonth())}</div>
                                      <div class="forecast-item__time">${getStringFromDateType(date)}</div>
                                  </div>
                                  <div class="forecast-item__weather">
                                      <div class="forecast-item__temp-parameters">
                                          <div class="forecast-item__temp">Temperature: ${Math.round(data.main.temp)}°</div>
                                          <div class="forecast-item__temp-feeling">Feels like: ${Math.round(data.main.feels_like)}°</div>
                                      </div>
                                      <div class="forecast-item__weather-parameters">
                                          <div class="forecast-item__weather-type">${data.weather[0].main}</div>
                                          <div class="forecast-item__weather-icon forecast-item__weather-icon_rain"></div>
                                      </div>
                                  </div>`;

    forecastWindow.forecastList.append(forecastItem);
}
forecastWindow.resetForecastItems = function() {
    const parentElem = forecastWindow.forecastList;
    let lastChildElem;
    while (lastChildElem = parentElem.lastChild) parentElem.removeChild(lastChildElem);
}

const changeInfoBtns = {
    now: document.querySelector(".change-info__now"),
    details: document.querySelector(".change-info__details"),
    forecast: document.querySelector(".change-info__forecast")
}


const locationList = document.querySelector(".location__list");

const favoriteCityTemplate = document.createElement('li');
favoriteCityTemplate.innerHTML = `<p class=\"location__city-name\"></p>
                                  <span class=\"location__delete-btn\"></span>`;



function getStringFromDateType(date) {
    // return hours and minutes from date type in UTC
    let resultTime = "";

    const hours = date.getHours();
    const minutes = date.getMinutes();

    resultTime += (hours < 10 ?
        "0" + hours :
        hours);

    resultTime += ":" + (minutes < 10 ?
        "0" + minutes :
        minutes);

    return resultTime;
}

function getStringMonth(monthNumber) {
    if (monthNumber === 0) return 'January';
    if (monthNumber === 1) return 'February';
    if (monthNumber === 2) return 'March';
    if (monthNumber === 3) return 'April';
    if (monthNumber === 4) return 'May';
    if (monthNumber === 5) return 'June';
    if (monthNumber === 6) return 'July';
    if (monthNumber === 7) return 'August';
    if (monthNumber === 8) return 'September';
    if (monthNumber === 9) return 'Oktober';
    if (monthNumber === 10) return 'November';
    if (monthNumber === 11) return 'December';
}

export {searchForm, nowWindow, detailsWindow, forecastWindow, changeInfoBtns, locationList, favoriteCityTemplate};