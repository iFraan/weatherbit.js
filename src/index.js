const axios = require('axios');

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
        this.cache = {};
        this._raw = {};
    }

    /**
     * Search a city or place and returns a result
     * @param {String} city Place to search
     * @returns Current Weather response
     */
    async search(city) {
        if (!city) throw new Error('Please provide a city to search for')
        try {
            const res = await axios.get(endpoints.current.replace('{TOKEN}', this.api_key).replace('{LANG}', this.lang).replace('{QUERY}', city), { timeout: this.timeout });
            this.cache[`${res.city_name}-${res.country_code}`]
            W.city = W._raw?.weatherdata?.weather?.[0] || W._raw?.weatherdata?.weather;
        } catch (err) {
            if (err.message.includes('code 500')) throw new Error('Server Internal Error')
            throw new Error(err.message)
        }
        if (!W.city) throw new Error(W._raw)
        return W;
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