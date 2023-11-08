const http = require('http');
const fs = require('fs');
const path = require('path');
const archivoVisitantes = path.join(__dirname, '..', 'gestionVisitantes','visitantes.json');


function getPermisos(res, idVisitante){
    fs.readFile(archivoVisitantes, 'utf8', (err, data) => {
        if (err) {;
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({error:'Error interno del servidor'}));
            return
        }
    
        const visitantes = JSON.parse(data);

        let visitante = visitantes.find(visitante=> visitante.id == idVisitante);

        if( visitante != undefined){
            //aca deberia agregar la logica para solo tomar los pisos a los que puede acceder
            res.writeHead(200,{'Content-Type':'application/json'});
            res.write(JSON.stringify({pisos_permitidos:`${visitante.pisos_permitidos}`}));

        }
        else{
            res.writeHead(404,{'Content-Type':'application/json'}); // devuelvo json
            res.write(JSON.stringify({message:"Error, no se encuentra esa visitante"})); // envio la sucursal  
        }

        res.end()
    })
}


function modificacionPermisos(res,id,nuevosDatos){
    fs.readFile(archivoVisitantes, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({error:'Error interno del servidor'}));
          return
        }
    
        const visitantes = JSON.parse(data);

        let visitante = visitantes.find(visitante=> visitante.id == idVisitante);

        console.log('datos originales:',visitante);
        console.log('nuevos datos: ',nuevosDatos);

        if(visitante != undefined){ //VERIFICAR EL TIPO DE DATO PARA EL ARREGLO
            visitante.pisos_permitidos = nuevosDatos;

            console.log('datos actualizados:',visitante);

            fs.writeFile(archivoVisitantes, JSON.stringify(visitantes, null, 2), (err) => {
                if (err) {
                  console.error(err);
                  res.writeHead(500, { 'Content-Type': 'application/json'});
                  res.end(JSON.stringify({error:'Error interno del servidor'}));
                  return
                }
        
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({message:`Permisos de visitante con ID ${id} actualizado.`}));
              });
        }
        else{
            res.writeHead(404,{'Content-Type':'application/json'}); // devuelvo json
            res.write(JSON.stringify({message:"Error, no se encuentra ese visitante"})); 
        }

    })
}


function datosIncorrectos(res){
    res.writeHead(400,{'Content-Type':'application/json'});
    res.write(JSON.stringify({message:"Error en el formato de los datos"}));
    res.end();
}


function rutaNoEncontrada(res){
    res.writeHead(404,{'Content-Type':'application/json'}); // devuelvo json
    res.write(JSON.stringify({message:"Error, no se encuentra la ruta en gestion permisos"}));   
    res.end();
}




const server = http.createServer((req, res) => {
    
    const {url , method} = req;
    console.log(`URL: ${url} - METHOD: ${method}`);

    let parametros = url.split('/');
    parametros = parametros.filter(el => el != '');

    if (method === 'OPTIONS') {
        // Configura los encabezados CORS para permitir la solicitud desde el origen específico
        res.writeHead(200, {
          'Access-Control-Allow-Origin': 'http://127.0.0.1:5500', // Reemplaza con tu origen permitido
          'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT', // Reemplaza con los métodos permitidos
          'Access-Control-Allow-Headers': 'Content-Type', // Reemplaza con los encabezados permitidos
        });
        res.end();

    }else if(url.startsWith("/api/permisos")){

        switch(method){ //DEFINI CUANDO NO TENGAS SUEÑO SI CONVIENE USAR CASE O IFs ANIDADOS
            case "GET":
                if(parametros.length === 3){
                    idVisitante = parametros[2];
                    console.log(`Request para devolver permisos de un visitante (ID: ${idVisitante})`);
                    getPermisos(res, idVisitante);
                }else{
                    rutaNoEncontrada(res);
                }

                break;

            case "PUT":
                if(parametros.length === 3){
                    idVisitante = parametros[2];
                    console.log(`Request para cambiar los permisos de un visitante (ID: ${idVisitante})`);
                    
                    let data = '';

                    req.on('data', (chunk) => {
                        data += chunk;
                    })

                    req.on('end', (chunk) => {
                        try{
                            const nuevosDatos = JSON.parse(data);
                            
                            console.log(nuevosDatos);
    
                            //if(validacionDatos(nuevosDatos)){
                                modificacionPermisos(res,idVisitante,nuevosDatos);
                            //}else{
                              //  datosIncorrectos(res);
                            //}
    
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