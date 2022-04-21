const crypto = require('crypto');

const {
   PASSWORD_LENGTH,
   SALT_LENGTH,
   ITERATIONS,
   DIGEST,
   BYTE_TO_STRING_ENCODING,
} = require('./config/hashConfig.json');

class Block {
   constructor(index, timestamp, data, previousHash) {
      const block = this;

      block.index = index;
      block.timestamp = timestamp;
      block.data = data;
      block.previousHash = previousHash;
      block.hash = this.calculateHash();
			block.nonce = 0;
   }

   calculateHash() {
      const salt = crypto
         .randomBytes(SALT_LENGTH)
         .toString(BYTE_TO_STRING_ENCODING);

      return crypto
         .pbkdf2Sync(
						this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce,
            salt,
            ITERATIONS,
            PASSWORD_LENGTH,
            DIGEST
         )
         .toString(BYTE_TO_STRING_ENCODING);
   }
}

class Blockchain {
   constructor() {
      this.blockchain = [this.createFirstBlock()];
   }
   createFirstBlock() {
      return new Block(0, "0/0/0", "genesis block", "0");
   }
   getLatestBlock() {
      return this.blockchain[this.blockchain.length - 1];
   }
   addNewBlock(newBlock) {
      const previousBlock = getLatestBlock();

			newBlock.previousHash = this.getLatestBlock().hash;

      newBlock.hash = newBlock.calculateHash();

      this.block1chain.push(newBlock);
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

let thecoin = new Blockchain();

// thecoin.addNewBlock(
//    new Block(1, '06/04/2021', {
//       sender: 'Rabin Yitzack',
//       recipient: 'Loyd Eve',
//       quantity: 20,
//    })
// );



console.log(JSON.stringify(thecoin));

// for (i = 0; i < 3; i++) {
//    CurrrenBlock = newBlock(CurrrenBlock);
//    blockchain.push(CurrrenBlock);
//    console.log(blockchain);
// }

// const blockchain = [getFirstBlock()];

// let CurrrenBlock = blockchain[0];

// const getLatestBlock = () => blockchain[blockchain.length - 1];

// const newBlock = (lastBlockData) => {
//    const previousBlock = getLatestBlock();
//    const nextIndex = previousBlock.index + 1;
//    const nextTimestamp = new Date().getTime() / 1000;
//    const nextHash = calculateHash(
//       nextIndex,
//       previousBlock.hash,
//       nextTimestamp,
//       lastBlockData
//    );

//    return new Block(
//       nextIndex,
//       lastBlockData,
//       nextTimestamp,
//       previousBlock.hash,
//       nextHash
//    );
// };

// for (i = 0; i < 3; i++) {
//    CurrrenBlock = newBlock(CurrrenBlock);
//    blockchain.push(CurrrenBlock);
//    console.log(blockchain);
// }

// module.exports = {
//   blockchain,
// };
