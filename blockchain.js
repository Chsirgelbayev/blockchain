const crypto = require("crypto");

const {
  PASSWORD_LENGTH,
  SALT_LENGTH,
  ITERATIONS,
  DIGEST,
  BYTE_TO_STRING_ENCODING,
} = require("./config/hashConfig.json");

class Block {
  constructor(index, lastData = [], timestamp, previousHash, hash) {
    const block = this;

    block.index = index;
    block.lastData = lastData;
    block.timestamp = timestamp;
    block.previousHash = previousHash;
    block.hash = hash.toString();
  }
}

const calculateHash = (
  nextIndex,
  previousBlockHash,
  nextTimestamp,
  lastBlockData
) => {
  const salt = crypto
    .randomBytes(SALT_LENGTH)
    .toString(BYTE_TO_STRING_ENCODING);

  return (hash = crypto
    .pbkdf2Sync(
      nextIndex + previousBlockHash + nextTimestamp + lastBlockData,
      salt,
      ITERATIONS,
      PASSWORD_LENGTH,
      DIGEST
    )
    .toString(BYTE_TO_STRING_ENCODING));
};

const getFirstBlock = () => {
  return new Block(
    0,
    "my new block!!",
    "0",
    1465154705,
    "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7"
  );
};

const blockchain = [getFirstBlock()];

let CurrrenBlock = blockchain[0];

const getLatestBlock = () => blockchain[blockchain.length - 1];

const newBlock = (lastBlockData) => {
  const previousBlock = getLatestBlock();
  const nextIndex = previousBlock.index + 1;
  const nextTimestamp = new Date().getTime() / 1000;
  const nextHash = calculateHash(
    nextIndex,
    previousBlock.hash,
    nextTimestamp,
    lastBlockData
  );

  return new Block(
    nextIndex,
    lastBlockData,
    nextTimestamp,
    previousBlock.hash,
    nextHash
  );
};

for (i = 0; i < 10; i++) {
  CurrrenBlock = newBlock(CurrrenBlock);
  blockchain.push(CurrrenBlock);
}

module.exports = {
  newBlock,
  blockchain,
  calculateHash,
};
