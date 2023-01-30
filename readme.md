<div align="center">
	<h1>weatherbit.js</h1>
	<h2>This a wrapper of the WeatherBit weather API</h2>
</div>

## Instalation
> Needs an API key, you can choose a free plan [here](https://www.weatherbit.io/)

> Needs Node v14+
#### Dependencies
``
axios
``

#### To install use:
```shell
npm i @ifraan_/weatherbit.js
```

## Usage

You need to initialize the class first with the API key

```js
const { API } = require('@ifraan_/weatherbit.js')
const api = new API(process.env.TOKEN);
```

Then you can query citys with the function `search`:

```js
await api.search('New York')
```

## Cache
This library cache results to reduce API usage, so if you keep doing the same query it should return the same result without calling the api again (if the time limit is not exceeded)

If you do not want to cache results, you must specify the option `cache_time` to be something like `0 ms`.

## Extra
You can pass options to the search function to tweak the settings as you like

| Option | Description | Default |
| - | - | - | 
| lang | The language code | en |
| units | M (Metric), S (Scientific) or I (Fahrenheit) | M |
| debug | Print extra statements | false |
| timeout | Timeout in ms | 10_000 (10 seconds) |
| cache_time | Cache time in ms | 45 * 60_000 (45 minutes) |

You can also import types directly from the library and use it as options
```js
const { API, UNITS, LANG } = require('@ifraan_/weatherbit.js');
const api = new API('TOKEN', {
	units: UNITS.Metric,
	lang: LANG.English,
})
```

## Official Documentation
* [Weather Current](https://www.weatherbit.io/api/weather-current)

## Disclaimer
This project is fully for educational purposes.