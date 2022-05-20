const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });
const { PORT, NODE_ENV } = process.env;
const { errorHandler } = require("./middleware/errorHadler");
const blockchain = require("./routes/blocks");

const app = express();

app.use(morgan("dev"));

app.use("/ethereum", blockchain).use(errorHandler);

const server = app.listen(PORT || 5200, () =>
    console.log(
        `Listening http on port: ${PORT} and running in ${NODE_ENV} mode`.white
            .bgCyan
    )
);

process.on("unhandledRejection", (e) => {
    console.log(`Error: ${e.message}`.red.underline.bold);
    server.close(() => process.exit(1));
});
