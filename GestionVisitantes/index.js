const http = require('http')

const server = http.createServer((req,res)=>{

    const{ url, method} = req;

    console.log(`URL: ${url} - METHOD: ${method}`);

    

})

server.listen(3501)//puerto de gestion visitantes
