const http = require('http');
const { bodyParser } = require('./bodyParser');
//const url = require('url');

const server = http.createServer((req,res) => {

    const { url , method } = req;
    console.log(`URL: ${url} - METHOD: ${method}`);

    //const parsedUrl = url.parse(req.url, true); se refiere al paquete que esta comentado arriba el url, no a la variable url

    let param = url.split("/");

    if(url.startsWith("")){

    }

});

server.listen(3500); // puerto del APIRest