const crypto = require("crypto");

const {
    PASSWORD_LENGTH,
    SALT_LENGTH,
    ITERATIONS,
    DIGEST,
    BYTE_TO_STRING_ENCODING,
} = require("../config/hashConfig.json");

class Block {
    constructor(index, current_time, data, previousHash) {
        const block = this;

        block.index = index;
        block.current_time = current_time;
        block.data = data;
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
                this.info +
                    this.previousHash +
                    this.current_time +
                    JSON.stringify(this.info),
                salt,
                ITERATIONS,
                PASSWORD_LENGTH,
                DIGEST
            )
            .toString(BYTE_TO_STRING_ENCODING);
    }

    addTransactions(transactions) {
        transactions.list.forEach((transaction) => {
            this.transactions.push(transaction);
        });
        transactions.reset();
    }
}

class Blockchain {
    constructor() {
        this.blockchain = [this.initGenesisBlock()];
    }

    initGenesisBlock() {
        return new Block(0, "0", "0", "0");
    }

    latestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    addNewBlock(newBlock) {
        newBlock.index = this.latestBlock().index + 1;
        newBlock.previousHash = this.latestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.blockchain.push(newBlock);
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

let bitcoin = new Blockchain();

bitcoin.chainIsValid();

for (i = 0; i < 10; i++) {
    bitcoin.addNewBlock(
        new Block(2, "07/04/2022", {
            sender: "Name",
            recipient: "Name",
            quantity: 349,
            coin: "btc",
        })
    );
}

module.exports = bitcoin;
