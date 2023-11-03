const http = require('http');
const fs = require('fs');
const archivoAscensores = __dirname + '/ascensores.json';
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

const schema = require('./esquema.json');


// REQUEST METODO GET (TODOS LOS ASCENSORES)
function getAscensores(res){
    fs.readFile(archivoAscensores, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error interno del servidor');
          return
        }
    
        const ascensores = JSON.parse(data);
        
        res.writeHead(200,{'Content-Type':'application/json'}); // devuelvo json
        res.write(JSON.stringify(ascensores)); // envio los ascensores
        res.end();
    })

}

// REQUEST METODO GET (UN ASCENSOR POR ID)
function getAscensor(res, id){

    fs.readFile(archivoAscensores, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error interno del servidor');
          return
        }
    
        const ascensores = JSON.parse(data);


        let ascensor = ascensores.find(ascensor=> ascensor.id == id);

        if( ascensor != undefined){
            res.writeHead(200,{'Content-Type':'application/json'});
            res.write(JSON.stringify(ascensor));
        }
        else{
            res.writeHead(404,{'Content-Type':'application/json'}); // devuelvo json
            res.write("Error, no se encuentra ese ascensor"); // envio la sucursal  
        }

        res.end()
    })
}


// REQUEST METODO POST (ALTA VISITANTE)
function altaAscensor(res,ascensor){
    fs.readFile(archivoAscensores, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end('Error interno del servidor');
            return;
        }
    
        const ascensores = JSON.parse(data);
    
        ascensores.push(ascensor);
    
        fs.writeFile(archivoAscensores, JSON.stringify(ascensores, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end('Error interno del servidor');
                return;
            }
    
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(ascensor));
        });
    });
}


// REQUEST METODO DELETE (UN VISITANTE POR ID)
function deleteAscensor(res, id) {
    fs.readFile(archivoAscensores, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end('Error interno del servidor');
          return
        }
    
        const ascensores = JSON.parse(data);
        
        const ascensorIndex = ascensores.findIndex(ascensor => ascensor.id === id)
    
        if (ascensorIndex !== -1) {
          ascensores.splice(ascensorIndex, 1); // Elimina el ascensor del arreglo
          console.log(`Visitante con ID ${id} eliminado.`);
    
          // Guarda el archivo JSON actualizado
          fs.writeFile(archivoAscensores, JSON.stringify(ascensores, null, 2), (err) => {
            if (err) {
              console.error(err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end('Error interno del servidor');
              return
            }
    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(`Ascensor con ID ${id} eliminado.`);
          });
        } else {
          console.log(`Ascensor con ID ${id} no encontrado.`);
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(`Ascensor con ID ${id} no encontrado.`);
        }
      })
}


// REQUEST METODO PUT (ACTUALIZAR DATOS VISITANTE POR ID)
function modificacionAscensor(res,id,nuevosDatos){
    fs.readFile(archivoAscensores, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error interno del servidor');
          return
        }
    
        const ascensores = JSON.parse(data);


        let ascensor = ascensores.find(ascensor=> ascensor.id == id);

        console.log('datos originales:',ascensor);
        console.log('nuevos datos: ',nuevosDatos);

        if(ascensor != undefined){
            ascensor.nombre = nuevosDatos.nombre;
            ascensor.pisos = nuevosDatos.pisos;
            ascensor.estado = nuevosDatos.estado;

            console.log('datos actualizados:',ascensor);

            fs.writeFile(archivoAscensores, JSON.stringify(ascensores, null, 2), (err) => {
                if (err) {
                  console.error(err);
                  res.writeHead(500, { 'Content-Type': 'text/plain' });
                  res.end('Error interno del servidor');
                  return
                }
        
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Visitante con ID ${id} actualizado.`);
              });
        }
        else{
            res.writeHead(404,{'Content-Type':'application/json'}); // devuelvo json
            res.write("Error, no se encuentra ese ascensor"); // envio la sucursal  
        }

    })
}



function validacionDatos(ascensor){

    const validate = ajv.compile(schema);
    const isValid = validate(ascensor);

    return  isValid;

}

// REQUEST INCORRECTA
function rutaNoEncontrada(res){
    res.writeHead(404,{'Content-Type':'application/json'}); // devuelvo json
    res.write("Error, no se encuentra la ruta en gestionAscensores"); // envio la sucursal  
    res.end();
}

function datosIncorrectos(res){
    res.writeHead(400,{'Content-Type':'application/json'});
    res.write("Error en el formato de los datos");
    res.end();
}


const server = http.createServer((req,res) => {

    const{ url, method} = req;

    console.log(`URL: ${url} - METHOD: ${method}`);

    if(url.startsWith("/api/ascensores")){

        let parametros = url.split('/');
        parametros = parametros.filter(el => el != '');
        //console.log(parametros);

        if(method === 'GET'){   

            if(url ===  '/api/ascensores/lista'){ //devolver todos los ascensores

                console.log('request para devolver todos los visitantes');
                getAscensores(res); //METODO QUE HAY QUE HACER

            }else if(url.startsWith('/api/ascensores/') && parametros.length === 3){ //devolver datos del ascensor seleccioinado

                const visitanteId = parametros[2];
                console.log(`Request para devolver un visitante especificado (ID: ${ visitanteId })`);//MODIFICAR

                getAscensor(res, visitanteId);
            }else{
                rutaNoEncontrada(res);
            }

        } else if(method === 'POST'){

            if(url === '/api/ascensores/alta'){ //crear nuevo ascensor

                console.log('request para dar de alta a un ascensor');

                let data = '';

                req.on('data', (chunk) => {
                    data += chunk;
                })

                req.on('end',()=>{
                    try{
                        console.log(data.length)
                        console.log(typeof data)
                        const nuevoAscensor = JSON.parse(data);
                        
                        console.log(nuevoAscensor);
                        console.log(nuevoAscensor.nombre);

                        if(validacionDatos(nuevoAscensor)){
                            //doy de alta
                            altaAscensor(res,nuevoAscensor);
                            console.log('se dio de alta el ascensor')
                        }else{
                            datosIncorrectos(res);
                        }

                    }catch(error){
                        console.log(error);
                        datosIncorrectos(res);
                    }

                })
            }
            else{
                rutaNoEncontrada(res);
            }

        } else if(method === 'DELETE'){

            if(url.startsWith('/api/ascensores/') && parametros.length === 3){ //eliminar ascensor seleccionado

                const ascensorID = parametros[2];
                console.log(`Request para dar de baja a un ascensor (ID: ${ascensorID})`);
                deleteAscensor(res, ascensorID);

            }else{
                rutaNoEncontrada(res);
            }

        }else if(method === 'PUT'){

            if(url.startsWith('/api/ascensores/') && parametros.length === 3){ //modificar datos del ascensor seleccionado

                const ascensorID = parametros[2];
                console.log(`Request para modificar un ascensor especificado (ID: ${ascensorID})`);
                
                
                let data = '';

                req.on('data', (chunk) => {
                    data += chunk;
                })

                req.on('end',()=>{
                    try{
                        const nuevosDatos = JSON.parse(data);
                        
                        console.log(nuevosDatos);

                        
                        if(validacionDatos(nuevosDatos)){

                            //doy de alta
                            modificacionAscensor(res,ascensorID,nuevosDatos);

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
        }

        
        
    }else{

        rutaNoEncontrada(res);
    
    }


})

server.listen(3502);