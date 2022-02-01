const storage = {
    favoriteCities: [],
    currentCity: ""
}

storage.loadData = function () {
    this.favoriteCities = JSON.parse(localStorage.getItem("favoriteCities")) || [];
    this.currentCity = localStorage.getItem("currentCity") || DEFAULT_CURRENT_CITY;
}

storage.saveFavoriteCities = function () {
    localStorage.setItem(
        "favoriteCities",
        JSON.stringify(storage.favoriteCities)
    );
}

storage.saveCurrentCity = function (cityName) {
    this.currentCity = cityName;
    localStorage.setItem(
        "currentCity",
        cityName
    );
}

storage.addFavoriteCity = function (cityName) {
    this.favoriteCities.push(cityName);
    this.saveFavoriteCities();
}

storage.deleteFavoriteCity = function (cityName) {
    this.favoriteCities.splice(this.favoriteCities.indexOf(cityName), 1);
    this.saveFavoriteCities();
}

storage.getFavoriteCities = function() {
    return this.favoriteCities;
}

storage.getCurrentCity = function () {
    return this.currentCity;
}


const DEFAULT_CURRENT_CITY = "Tomsk";


storage.loadData();

export {storage};
