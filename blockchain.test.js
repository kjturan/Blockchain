const Blockchain = require('./blockchain');
const Block = require('./block');
const cryptoHash = require('./cryptoHash');

describe('Blockchain',() => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain.chain;
    });

    it('contains a `chain` array instance',() => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('begins with the genesis block',() => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain',() => {
        const newData = 'foo bar';
        blockchain.addBlock({data:newData});
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()',() => {
        describe('when the chain does not start with the genesis block',() => {
            it('returns false',() => {
                blockchain.chain[0] = { data: 'fake'};
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });
        describe('when the chain starts with the genesis block and has multiple blocks',() => {
            beforeEach(() => {
                blockchain.addBlock({ data:'lemon' });
                blockchain.addBlock({ data:'lime' });
                blockchain.addBlock({ data:'orange' });
            });

            describe('and a lasthash reference has changed',() => {
                it('returns false',() => {
                    blockchain.chain[1].lastHash = 'broken-lastHash';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with an invalid field',() => {
                it('returns false',() => {
                    blockchain.chain[1].data = 'bad evil data';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain does not contain any invalid blocks',() => {
                it('returns true',() => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });

            describe('and the chain contains a block with a jumped difficulty',() => {
                it('returns false',() => {
                    const lastBlock = blockchain.chain[blockchain.chain.length-1];
                    const lastHash = lastBlock.hash;
                    const timeStamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 2;

                    const hash = cryptoHash(timeStamp, lastHash, difficulty, nonce, data);
                    const badBlock = new Block({timeStamp, lastHash, hash, nonce, difficulty, data});
                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                })
            });
        });    
    });

    describe('replaceChain()',() => {
        describe('when the new chain is not longer',() => {
            it('does not replace the chain',() => {
                newChain.chain[0] = { new:'chain'};
                blockchain.replaceChain(newChain.chain);
                expect(blockchain.chain).toEqual(originalChain);
            });
        });

        describe('when the new chain is longer',() => {
            beforeEach(() => {
                newChain.addBlock({ data:'lemon' });
                newChain.addBlock({ data:'lime' });
                newChain.addBlock({ data:'orange' });
                newChain.addBlock({ data:'grapefruit' });
            });

            describe('and the chain is invalid',() => {
                it('does not replace the chain',() => {
                    newChain.chain[3].hash = 'fakeHash';
                    blockchain.replaceChain(newChain.chain instanceof Blockchain);
                    expect(blockchain.chain).toEqual(originalChain);
                });
            });
        
            describe('and the chain is valid',() => {
                it('replace the chain',() => {
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
            });
        });
    });
});