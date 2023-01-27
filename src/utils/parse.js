/**
 * meant to parse the city to City, 
 * @param {String} city 
 * @returns {City} {name: string, state?: string, country?: string}
 */
const parseCity = (city) => {
    const arr = city.split(',');
    const data = {}
    data.name = arr[0];
    switch (arr.length) {
        case 2:
            data.countryCode = arr[1];
            break;
        case 3:
            data.state = arr[1];
            data.country = arr[2];
            break;
    }
    return data;
}

/**
 * Parse the raw data into a legible one
 * @param {Axios.Response.data} response 
 * @returns {CurrentWeather} Current Weather object
 */
const parseCurrent = (response) => {
    /* 
    Docs: https://www.weatherbit.io/api/weather-current
    */
    const data = {
        temperature: response.temp,
        feelslike: response.app_temp,
        city: {
            name: response.city_name,
            state: response.state_code,
            country: response.country_code,
            latitude: response.lat,
            longitude: response.lon,
        },
        wind: {
            speed: response.win_spd,
            direction: {
                degrees: response.wind_dir,
                short: response.wind_cdir,
                text: response.wind_cdir_full
            },
            display: _formatWindDisplay(response.win_spd, response.wind_cdir_full)
        },
        weather: {
            /* icon, code, description */
            ...response.weather
        },
        humidity: response.rh,
        sun: {
            uv_index: response.uv,
            radiation: response.solar_rad,
        },
        clouds: response.clouds,
        visibility: response.vis,
        precipitation_rate: response.precip, /* mm/hr */
        snow_rate: response.snow, /* mm/hr */
        time: {
            observation: {
                timestamp: response.ts,
                display: response.ob_time,
            },
            sunset: response.sunset,
            sunrise: response.sunrise,
            timezone: response.timezone,
        },
        raw: {
            ...response
        },
    }
    return data;
}

/* speed its in meters per second */
const _formatWindDisplay = (speed, display) => (`${Math.round(speed * 3.6)} km/h ${display}`);

module.exports = {
    parseCity,
    parseCurrent,
}