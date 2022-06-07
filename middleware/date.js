const reqStart = (req, res, next) => {
    req.start = Date.now();
    res.start = req.start;
    next();
};

const convertToTimestampZ = timestamp => {
    let date = new Date();

    if (timestamp.constructor === String) {
        return timestamp;
    } else {
        date.setTime(timestamp);

        return date.toISOString();
    }
};

module.exports = {
    reqStart,
    convertToTimestampZ,
};
