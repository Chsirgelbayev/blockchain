const express = require("express");
const dotenv = require("dotenv");

const { blockchain, newBlock, calculateHash } = require("./Blockchain");

dotenv.config({ path: "./config/config.env" });
const { PORT, NODE_ENV } = process.env;

const server = () => {
  const app = express();

  app.get("/blocks", (req, res) => {
    res.status(200).json({ success: true, data: blockchain });
  });

  app.listen(PORT, () =>
    console.log(
      `Listening http on port: ${PORT}, and running in ${NODE_ENV} mode`
    )
  );
};

server();
