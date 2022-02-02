function getCookies() {
    let cookies = document.cookie.split("; ");
    const cookiesObj = {}
    for (let cookie of cookies) {
        let [key, value] = cookie.split("=");
        cookiesObj[key] = value;
    }

    return cookiesObj;
}

function getCookie(name) {
    let cookies = document.cookie.split("; ");
    let value;
    for (let cookie of cookies) {
        if (cookie.includes(name)) {value = cookie.split("=")[1];}
    }

    return value;
}

function setCookies(cookiesObject) {
    for (let [key, value] of Object.entries(cookiesObject)) {
        document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
}

function setCookie(key, value, options = {}) {
    options = {
        path: '/',
        ...options
    }

    let updatedCookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

export {getCookies, getCookie, setCookies, setCookie};