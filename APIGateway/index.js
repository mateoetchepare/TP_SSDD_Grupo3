const http = require('http');
const { bodyParser } = require('./bodyParser');

const server = http.createServer((req,res) => {

    const { url , method } = req;
    console.log(`URL: ${url} - METHOD: ${method}`);


});

server.listen(3500); // puerto del APIRest