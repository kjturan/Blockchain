const crypto = require('crypto');

const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256'); //an instance of the SHA-256 class
    hash.update(inputs.sort().join(' ')); //application of hash function
    return hash.digest('hex'); 
};

module.exports = cryptoHash;