const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());

app.get('/api/blocks',(request, response) => {
    response.json(blockchain.chain);

});

app.post('/api/mine',(request, response) => {
    const {data} = request.body;
    blockchain.addBlock({data});
    pubsub.broadcastChain();
    response.redirect('/api/blocks');
});


const syncChains = () => {
    request({url:`${ROOT_NODE_ADDRESS}/api/blocks`},(error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            blockchain.replaceChain(rootChain);
            console.log('replace chain on sync with', rootChain);
        }
    });
};

let PEER_PORT;
if(process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random()*1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT,() => {
    console.log(`listening at localHost: ${PORT}`);
    if(PORT !== DEFAULT_PORT) {
        syncChains();
    }
})