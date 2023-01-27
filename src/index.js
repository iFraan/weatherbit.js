const axios = require('axios');
const { parseCity, parseCurrent } = require('./utils/parse');

const baseUrl = 'https://api.weatherbit.io/v2.0';

const endpoints = {
    current: `${baseUrl}/current?key={TOKEN}&lang={LANG}&city={QUERY}`,
    forecast: `${baseUrl}/forecast?key={TOKEN}&lang={LANG}&city={QUERY}`,
}

class API {

    constructor(api_key, options = {}) {
        if (!api_key) throw new Error('Please provide an apikey.')
        this.api_key = api_key;
        this.lang = options.lang || 'en';
        this.units = options.units || 'M';
        this.timeout = options.timeout || 10_000; // 10 seconds
        this.cacheTime = options.cache_time || 45 * 60_000; // 45 min
        this.cache = {};
        this._raw = {};
    }

    /**
     * fetch a city and add it to the cache
     * @param {String}
     * @returns {CurrentWeather}
     */
    async #fetchCity(city) {
        if (!city) throw new Error('Please provide a city to search for')
        try {
            const res = await axios.get(endpoints.current.replace('{TOKEN}', this.api_key).replace('{LANG}', this.lang).replace('{QUERY}', city), { timeout: this.timeout })
                .catch(e => { throw new Error(e.message) });
            const cacheKey = `${res.data.city_name}-${res.data.country_code}`
            this.cache[cacheKey] = {
                data: parseCurrent(res.data),
                timestamp: Date.now()
            }
            return cacheKey;
        } catch (err) {
            throw new Error(err.message)
        }
    }

    /**
     * Search a city or place and returns a result
     * @param {String} city Place to search
     * @returns Current Weather response
     */
    async search(city) {
        if (!city) throw new Error('Please provide a city to search for')
        const city = parseCity(city);
        /* validates cache and if it doesnt exists does the request */
        let cacheKey = `${city.name}-${city.country}`
        if (!this.cache[cacheKey]) {
            if ((this.cache[cacheKey].timestamp - Date.now()) > this.cacheTime) {
                cacheKey = await this.#fetchCity(city);
            }
        }
        return { ...this.cache[cacheKey], cacheKey };
    }
    /**
     * Current
     * @returns current weather with observation time
     */
    current() {
        return this.city.current;
    }

    /**
     * Forecast
     * @returns next days weather forecast
     */
    forecast() {
        return this.city.forecast;
    }
    /**
     * Info
     * @returns next days weather forecast
     */
    info() {
        const C = this.city;
        const INFO = {
            location_code: C.weatherlocationcode,
            location_name: C.weatherlocationname,
            degree: C.degreetype,
            provider: {
                name: C.provider,
                url: C.attribution
            },
            coords: {
                latitude: C.lat,
                longitude: C.long,
            },
            timezone: C.timezone
        };

        return INFO;
    }

    /**
     * Raw
     */
    get raw() { return this._raw; }
}


module.exports = {
    API
}