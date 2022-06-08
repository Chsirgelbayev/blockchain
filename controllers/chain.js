const { ErrorResponce } = require('../middleware/errorHadler');
const { Transaction, Blockchain } = require('../models/blockchain');

const Ethereum = new Blockchain();
const { blockchain } = Ethereum;

const getChain = (req, res, next) => {
    if (!blockchain.length) {
        return next(new ErrorResponce('Blockchain empty', 404));
    }


    res.status(200).json({
        success: true,
        blockchain
    });
};

const getTransaction = (req, res, next) => {
    if (!blockchain.length) {
        return next(new ErrorResponce('Blockchain empty', 404));
    }


    const searchTransaction = chain => {
        let result;

        chain.forEach(async obj => {
            for (let key of obj.transactions) {
                if (key._id === req.params.id) {
                    result = key;
                }
            }
        });

        return result;
    };

    const transaction = searchTransaction(blockchain);


    if (!transaction) {
        return next(new ErrorResponce('Transaction not found', 404));
    }

    res.status(200).json({ transaction });
};

const createTransaction = (req, res, next) => {
    const { email, amount } = req.body;
    const { transactions } = Ethereum.latestBlock();

    if (!email || !amount) {
        return next(new ErrorResponce('Please enter data'), 400);
    }

    const validateEmail = email => {
        return email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    if (
        email.length < 4 ||
        email.length > 25 ||
        validateEmail(email) === null
    ) {
        return next(
            new ErrorResponce('Invalid email, please enter a valid email'),
            400
        );
    }

    const searchPrevAdress = () => {
        for (let key of transactions) {
            return key.to;
        }
    };

    const transaction = new Transaction(
        searchPrevAdress() || null,
        email || null,
        amount || 0
    );

    Ethereum.createTransactions(transaction);

    Ethereum.minePendTransaction(email, req.start);

    res.status(201).json({
        data: transaction
    });
};

const getBalance = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorResponce('Please enter data'), 400);
    }

    res.status(200).json({
        balance: Ethereum.getBalance(email)
    });
};

module.exports = {
    getChain,
    createTransaction,
    getTransaction,
    getBalance
};
