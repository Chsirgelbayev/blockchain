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

const createDateNow = (year, month, numDate) => {
    let today;

    if (year && month && numDate) {
        today = new Date(year, month, numDate);
    } else {
        today = new Date();
    }

    const date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();
    const time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    return `${date} ${time}`;
};

module.exports = {
    reqStart,
    convertToTimestampZ,
    createDateNow
};
