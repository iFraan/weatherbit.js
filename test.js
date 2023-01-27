const { API } = require('./index');
const TOKEN = '';
const api = new API(TOKEN);

const m = async () => {
    try {
        const city = await api.search('Broklyn, NY', { degree: 'F', lang: 'es-ES' })
        console.log('Info: ', city.info())
        console.log('Current: ', city.current())
        console.log('Forecast: ', city.forecast())
    } catch (err) {
        console.log(err)
    }
}
m()
