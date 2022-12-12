require('dotenv').config();

const app = require('./app');

const init = async () => {
    await app.listen(app.get('PORT'))
    console.log('Server listening on port ', app.get('PORT'))
}

init();