const axios = require('axios');
const { parseCity, parseCurrent } = require('./utils/parse');
const { LANG, UNITS } = require('./utils/constants');

const baseUrl = 'https://api.weatherbit.io/v2.0';

const endpoints = {
    current: `${baseUrl}/current?key={TOKEN}&lang={LANG}&city={QUERY}`,
}

class API {

    constructor(api_key, options = {}) {
        if (!api_key) throw new Error('Please provide an apikey.')
        this.api_key = api_key;
        this.lang = options.lang || 'en';
        this.units = options.units || 'M';
        this.debug = !!options.debug || false;
        this.timeout = options.timeout || 10_000; // 10 seconds
        this.cacheTime = options.cache_time || 45 * 60_000; // 45 min
        this.cache = {};
        this.lv2_cache = {};
    }

    /**
     * fetch a city and add it to the cache
     * @param {String}
     * @returns {CurrentWeather}
     */
    async #fetchCity(city) {
        if (this.debug) console.log(`Fetching data for ${city}`)
        if (!city) throw new Error('Please provide a city to search for')
        try {
            const res = await axios.get(endpoints.current.replace('{TOKEN}', this.api_key).replace('{LANG}', this.lang).replace('{QUERY}', city), { timeout: this.timeout })
                .catch(e => { throw new Error(e.message) });
            const cacheKey = `${res.data.data[0].city_name}-${res.data.data[0].country_code}`;
            this.cache[cacheKey] = {
                data: parseCurrent(res.data?.data?.[0]),
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
    async search(_city) {
        if (!_city) throw new Error('Please provide a city to search for')
        const city = this.lv2_cache[_city] ? this.lv2_cache[_city] : parseCity(_city);
        /* validates cache and if it doesnt exists does the request */
        let cacheKey = `${city.name}-${city.country}`
        if (!this.cache[cacheKey] || ((Date.now() - this.cache[cacheKey].timestamp) > this.cacheTime)) {
            cacheKey = await this.#fetchCity(_city);
            this.lv2_cache[_city] = cacheKey;
        }
        return { ...this.cache[cacheKey] };
    }

}


module.exports = {
    API,
    UNITS,
    LANG,
}