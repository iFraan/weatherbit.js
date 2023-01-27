const { API } = require('./index');
const TOKEN = '';
const api = new API(TOKEN);

const m = async () => {
    try {
        /* fetches data */
        await api.search('New York')
            .then(console.log);
        /* uses cached data if used in the last 45 min */
        await api.search('New York')
            .then(console.log);;
    } catch (err) {
        console.log(err)
    }
}
m()
