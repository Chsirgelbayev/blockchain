const crypto = require('crypto');
const { convertToTimestampZ } = require('../middleware/date');


const {
    PASSWORD_LENGTH,
    SALT_LENGTH,
    TRANSACTION_LENGTH,
    ITERATIONS,
    DIGEST,
    BYTE_TO_STRING_ENCODING,
} = require('../config/hashConfig.json');


const {
    COMPARATIVE_INTEGER,
    GENBLOCK_CURRENT_TIME,
    GENBLOCK_TRANSACTIONS,
    GENBLOCK_PREVHASH,
} = process.env;


class Block {
    constructor(current_time, transactions, previousHash) {

        const block = this;

        block.index = 0;
        block.current_time = current_time;
        block.transactions = transactions;
        block.previousHash = previousHash;
        block.hash = block.calculateHash();
        block.nonce = 0;
    }


    calculateHash() {
        const salt = crypto
            .randomBytes(SALT_LENGTH)
            .toString(BYTE_TO_STRING_ENCODING);


        return crypto
            .pbkdf2Sync(
                this.previousHash +
                    this.current_time +
                    this.data +
                    JSON.stringify,
                salt,
                ITERATIONS,
                PASSWORD_LENGTH,
                DIGEST
            )
            .toString(BYTE_TO_STRING_ENCODING);
    }


    miner(checkNumLenHash, blockchain, previousHash) {
        this.index = blockchain.length;
        this.previousHash = previousHash;


        while (
            this.hash.substring(0, checkNumLenHash) !==
            String().padStart(checkNumLenHash, 0)
        ) {
            this.hash = this.calculateHash();
            this.nonce++;
        }
    }
}

class Blockchain {
    constructor() {
        this.blockchain = [this.initGenesisBlock()];
        (this.int = COMPARATIVE_INTEGER),
        (this.credentials = []),
        (this.pendTransactions = []);
    }


    initGenesisBlock() {
        return new Block(
            GENBLOCK_CURRENT_TIME,
            GENBLOCK_TRANSACTIONS,
            GENBLOCK_PREVHASH
        );
    }


    latestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }


    minePendTransaction(minerReceiptAdress, reqStart) {
        let block = new Block(
            convertToTimestampZ(reqStart),
            this.pendTransactions
        );


        block.miner(this.int, this.blockchain, this.latestBlock().hash);
        this.blockchain.push(block);
    }


    createTransactions(transaction) {
        this.pendTransactions.push(transaction);
    }


    getBalance(adress) {
        let balance = 0;


        for (const block of this.blockchain) {
            for (const transaction of block.transactions) {
                if (transaction.from === adress) {
                    balance -= transaction.amount;
                }

                if (transaction.to === adress) {
                    balance += transaction.amount;
                }
            }
        }


        return balance;
    }


    chainIsValid() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const previousBlock = this.blockchain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

class Transaction {
    constructor(from, to, amount) {

        const transaction = this;

        transaction.from = from;
        transaction.to = to;
        transaction.amount = amount;
        transaction._id = this.calculateHash();
    }


    calculateHash() {
        const salt = crypto
            .randomBytes(SALT_LENGTH)
            .toString(BYTE_TO_STRING_ENCODING);

						
        return crypto
            .pbkdf2Sync(
                this.from + this.to + this.amount + JSON.stringify,
                salt,
                ITERATIONS,
                TRANSACTION_LENGTH,
                DIGEST
            )
            .toString(BYTE_TO_STRING_ENCODING);
    }
}

module.exports = {
    Blockchain,
    Transaction
};
