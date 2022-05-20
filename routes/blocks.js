const express = require("express");
const router = express.Router();

const { ErrorResponce } = require("../middleware/errorHadler");

const Ethereum = require("../models/blockchain");
const { blockchain } = Ethereum;

router.route("/").get((req, res, next) => {
    if (!blockchain.length) {
        return next(new ErrorResponce(`Blockchain empty`, 404));
    }

    res.status(200).json({ success: true, blockchain });
});

router.route("/:id").get((req, res, next) => {
    if (!blockchain.length) {
        return next(new ErrorResponce(`Blockchain empty`, 404));
    }

    const reqNumId = Number(req.params.id);

    blockchain.forEach((obj) => {
        if (obj.index === reqNumId) {
            res.status(200).json({ success: true, obj });
        }
    });
});

module.exports = router;
