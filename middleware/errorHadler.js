class ErrorResponce extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // if (err.name === "ReferenceError") {
    //     const message = "ReferenceError: Server did not respond";
    //     error = new ErrorResponce(message, 500);
    // }

    // if (err.name === "TypeError") {
    //     const message = "TypeError: Server did not respond";
    //     error = new ErrorResponce(message, 500);
    // }

    res.status(err.statusCode || 500).json({
        success: false,
        error: error.message || "Server has an error",
    });
};

module.exports = {
    ErrorResponce,
    errorHandler,
};
