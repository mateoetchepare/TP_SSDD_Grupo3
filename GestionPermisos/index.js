const http = require('http');
const fs = require('fs');
const archivoVisitantes = __dirname + '/visitantes.json';


function getPermisos(res, idVisitante){
    fs.readFile(archivoVisitantes, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error interno del servidor');
          return
        }
    
        const visitantes = JSON.parse(data);

        let visitante = visitantes.find(visitante=> visitante.id == id);

        if( visitante != undefined){
            res.writeHead(200,{'Content-Type':'application/json'});

            //aca deberia agregar la logica para solo tomar los pisos a los que puede acceder

            res.write(JSON.stringify(visitante));
        }
        else{
            res.writeHead(404,{'Content-Type':'application/json'}); // devuelvo json
            res.write("Error, no se encuentra esa visitante"); // envio la sucursal  
        }

        res.end()
    })
}


function modificacionPermisos(res,id,nuevosDatos){
    fs.readFile(archivoVisitantes, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error interno del servidor');
          return
        }
    
        const visitantes = JSON.parse(data);

        let visitante = visitantes.find(visitante=> visitante.id == id);

        console.log('datos originales:',visitante);
        console.log('nuevos datos: ',nuevosDatos);

        if(visitante != undefined){
            visitante.pisos_permitidos = nuevosDatos.pisos_permitidos;

            console.log('datos actualizados:',visitante);

            fs.writeFile(archivoVisitantes, JSON.stringify(visitantes, null, 2), (err) => {
                if (err) {
                  console.error(err);
                  res.writeHead(500, { 'Content-Type': 'text/plain' });
                  res.end('Error interno del servidor');
                  return
                }
        
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Permisos de visitante con ID ${id} actualizado.`);
              });
        }
        else{
            res.writeHead(404,{'Content-Type':'application/json'}); // devuelvo json
            res.write("Error, no se encuentra ese visitante"); // envio la sucursal  
        }

    })
}


function modificacionPermisos(res,visitanteId,nuevosDatos){


}


function datosIncorrectos(res){
    res.writeHead(400,{'Content-Type':'application/json'});
    res.write("Error en el formato de los datos");
    res.end();
}


function rutaNoEncontrada(res){
    res.writeHead(404,{'Content-Type':'application/json'}); // devuelvo json
    res.write("Error, no se encuentra la ruta en gestionVisitantes"); // envio la sucursal  
    res.end();
}




const server = http.createServer((req, res) => {
    
    const {url , method} = req;
    console.log(`URL: ${url} - METHOD: ${method}`);
    
    let parametros = url.split('/');

    if(url.startsWith("/api/permisos")){

        switch(method){ //DEFINI CUANDO NO TENGAS SUEÑO SI CONVIENE USAR CASE O IFs ANIDADOS
            case "GET":
                if(parametros.length === 3){
                    idVisitante = parametros[2];
                    console.log(`Request para devolver permisos de un visitante (ID: ${visitanteId})`);
                    getPermisos(res, idVisitante);
                }else{
                    rutaNoEncontrada(res);
                }

                break;

            case "PUT":
                if(parametros.length === 3){
                    idVisitante = parametros[2];
                    console.log(`Request para cambiar los permisos de un visitante (ID: ${visitanteId})`);
                    
                    let data = '';

                    req.on('data', (chunk) => {
                        data += chunk;
                    })

                    req.on('end', (chunk) => {
                        try{
                            const nuevosDatos = JSON.parse(data);
                            
                            console.log(nuevosDatos);
    
                            if(validacionDatos(nuevosDatos)){
                                modificacionPermisos(res,visitanteId,nuevosDatos);
                            }else{
                                datosIncorrectos(res);
                            }
    
                        }catch(error){
                            console.log(error);
                            datosIncorrectos(res);
                        }
                    })

                }else{
                    rutaNoEncontrada(res);
                }

                break;

        }



    }


})

server.listen(3503);