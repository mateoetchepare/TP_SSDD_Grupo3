const http = require('http');

const server = http.createServer((req,res) => {

    const { url , method } = req;
    console.log(`URL: ${url} - METHOD: ${method}`);

    res.writehead(200, {'Content-Type': 'text/plain'});
    res.write("Received");
    res.end();

});

server.listen(3500); // puerto del APIRest
console.log('Server on port',3500);