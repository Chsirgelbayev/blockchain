const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const prometheus = require('express-prometheus-middleware');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });
const promeConfig = require('./config/promConfig');
const { errorHandler } = require('./middleware/errorHadler');
const { reqStart } = require('./middleware/date');
const { PORT, METRICS_PORT, NODE_ENV } = process.env;

const {
    getChain,
    getTransaction,
    createTransaction,
    getBalance
} = require('./controllers/chain');

const app = express();
const metricsApp = express();

metricsApp.use(prometheus(promeConfig));

app
    .use(express.json())
    .use(morgan('dev'))
    .use(reqStart)
    .get('/chain', getChain)
    .get('/transaction/:id', getTransaction)
    .get('/balance', getBalance)
    .post('/transaction', createTransaction)
    .use(errorHandler);

const server = app.listen(PORT || 3001, () =>
    console.log(`Server running in ${NODE_ENV} mode on ${PORT} PORT`.bgWhite)
);

const metricServer = metricsApp.listen(METRICS_PORT || 9001);

process.removeAllListeners('warning');

process.on('unhandledRejection', e => {
    console.log(`Error: ${e}`.red);

    server.close(() => {
        metricServer.close(() => process.exit(1));
    });
});
