const crypto = require('crypto');

const {
   PASSWORD_LENGTH,
   SALT_LENGTH,
   ITERATIONS,
   DIGEST,
   BYTE_TO_STRING_ENCODING,
} = require('./config/hashConfig.json');

class Block {
   constructor(index, current_time, info, nextHash) {
      const block = this;

      block.index = index;
      block.current_time = current_time;
      block.info = info;
      block.nextHash = nextHash;
      block.hash = block.calculateHash();
   }

   calculateHash() {
      const salt = crypto
         .randomBytes(SALT_LENGTH)
         .toString(BYTE_TO_STRING_ENCODING);

      return crypto
         .pbkdf2Sync(
            this.info +
               this.nextHash +
               this.current_time +
               JSON.stringify(this.info),
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
      this.block1chain = [this.initGenesisBlock()];
   }
   initGenesisBlock() {
      return new Block(0, '06/04/2021', 'Initial Block in the Chain', '0');
   }
   latestBlock() {
      return this.block1chain[this.block1chain.length - 1];
   }
   addNewBlock(newBlock) {
      newBlock.nextHash = this.latestBlock().hash;
      newBlock.hash = newBlock.calculateHash();
      this.block1chain.push(newBlock);
   }
}

const checkValidity = () => {
   for (let i = 1; i < this.block1chain.length; i++) {
      const currentBlock = this.block1chain[i];
      const nextBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
         return false;
      }

      if (currentBlock.nextHash !== nextBlock.hash) {
         return false;
      }
      return true;
   }
};

let thecoin = new Blockchain();

thecoin.addNewBlock(
   new Block(1, '06/04/2021', {
      sender: 'Rabin Yitzack',
      recipient: 'Loyd Eve',
      quantity: 20,
   })
);

thecoin.addNewBlock(
   new Block(2, '07/04/2021', {
      sender: 'Anita Vyona',
      recipient: 'Felix Mush',
      quantity: 349,
   })
);

console.log(JSON.stringify(thecoin, null, 4));
