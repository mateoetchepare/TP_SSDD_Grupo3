const http = require('http')

const server = http.createServer((req,res)=>{

    const{ url, method} = req;

    console.log(`URL: ${url} - METHOD: ${method}`);

    //falta verificar ruteos segun url

    // metodo POST para alta de un visitante
    if (method === 'POST'){
        let body = ''
        req.setEncoding('utf8')

        req.on('data', (chunk) =>{
            body += chunk
        })

        req.on('end', () =>{
            console.log(body)

            try {
                const jsonData = JSON.parse(body)

                console.log('JSON data: ', jsonData)

            } catch(error){
                res.statusCode = 400
                res.end('Error analizando JSON')
            }
        })

    }

    res.end('Solicitud recibida exitosamente')
})

server.listen(3501)//puerto de gestion visitantes
