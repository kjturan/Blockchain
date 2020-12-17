const Block = require('./block');
const cryptoHash = require('./cryptoHash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({data}) {
        const newBlock = Block.mineBlock({
        lastBlock: this.chain[this.chain.length-1],
        data: data });
    this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for(let i = 1; i < chain.length; i++) {
            const {timeStamp, lastHash, hash, data, nonce, difficulty} = chain[i];
            const realLastHash = chain[i-1].hash;
            if(lastHash !== realLastHash) {
                return false;
            }   

            const validatedHash = cryptoHash(timeStamp,lastHash,data,nonce,difficulty);
            if(hash !== validatedHash) {
                return false;
            }

            const lastDifficulty = chain[i-1].difficulty;
            if(Math.abs(lastDifficulty - difficulty) > 1) {
                return false;
            }
        }
        return true;
    }

    replaceChain(newChain) {
        if(newChain.length <= this.chain.length) {
            //console.error('The incoming chain must be longer');
            return;
        }

        if(!Blockchain.isValidChain(newChain)) {
            //console.error('The incoming chain is not valid')
            return;
        }
        //console.log('Replacing chain with',newChain);
        this.chain = newChain;  
    }
}    

module.exports = Blockchain;