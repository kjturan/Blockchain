const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;

const GENESIS_DATA = {
    timeStamp: 1,
    lastHash: 'null',
    hash: '1',
    nonce: 0,
    difficulty: INITIAL_DIFFICULTY,
    data: []
};

module.exports = {GENESIS_DATA, MINE_RATE};