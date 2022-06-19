const axios = require('axios');
const { convertToTimestampZ, createDateNow } = require('../middleware/date');
const { NODE_ENV, GRAY_LOG_HOST, GRAY_LOG_PATH, GRAY_LOG_PORT } = process.env;

const sendLogs = async (req, res, json, statusCode) => {
    res.status(statusCode).json(json);

    const logs = {
        address:
            (req.headers && req.headers['x-real-ip']) ||
            req.connection.remoteAddress,
        host: req.get('host') + req.baseUrl,
        receiveDate: convertToTimestampZ(req.start),
        receiveMessage: req.body,
        sendDate: createDateNow(),
        sendMessage: json,
        short_message: req.method,
        statusCode
    };

    let protocol;

    NODE_ENV === 'prod' ? (protocol = 'https') : (protocol = 'http');

    await axios
        .post(
            `${protocol}://${GRAY_LOG_HOST}:${GRAY_LOG_PORT}/${GRAY_LOG_PATH}`,
            logs
        )
        .catch(e => {
            console.log(`Logs not sent. Error:${e.message}`.red);
        });
};

module.exports = {
    sendLogs
};
