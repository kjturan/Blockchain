const Blockchain = require('./blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({data:'first'});
let prevTStamp, nextTStamp, nextBlock, timeDiff, average;

const times = [];
for(let i = 0; i < 10000; i++) {
    prevTStamp = blockchain.chain[blockchain.chain.length-1].timeStamp;

    blockchain.addBlock({data:`block ${i}`});
    nextBlock = blockchain.chain[blockchain.chain.length-1];
    nextTStamp = nextBlock.timeStamp;
    timeDiff = nextTStamp - prevTStamp;
    times.push(timeDiff);
    average = times.reduce((total,num) => (total+num))/times.length;
    console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms.`);
}