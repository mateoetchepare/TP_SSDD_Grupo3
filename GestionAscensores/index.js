const http = require('http');
const fs = require('fs');
const archivoAscensores = __dirname + '/ascensores.json';
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

const schema = require('./esquema.json');
const { spawn } = require('child_process');
const { v1: uuidv1 } = require('uuid');

// REQUEST METODO GET (TODOS LOS ASCENSORES)
function getAscensores(res){
    fs.readFile(archivoAscensores, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({error:'Error interno del servidor'}));
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
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({error:'Error interno del servidor'}));
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
            res.write(JSON.stringify({message:"Error, no se encuentra ese ascensor"})); // envio la sucursal  
        }

        res.end()
    })
}

//SE DA DE ALTA A LOS ASCENSORES QUE YA ESTAN GUARDADOS EN EL JSON
function altaChildProcessDelJSON(){
    fs.readFile(archivoAscensores, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
    
        const ascensores = JSON.parse(data);

        ascensores.forEach(ascensor => {
            //creo el proceso hijo para el ascensor
            const childProcess = spawn('node', ['scriptAscensor.js',  JSON.stringify(ascensor)]);
            //const childProcess = spawn('node', ['scriptAscensor.js', "{ \"id\": \"c84605a4-7a60-11ye-b982-0242ac129300\", \"nombre\": \"C\", \"pisos\": [ 1, 2, 3, 5, 9 ], \"estado\": \"Disponible\" }"]);
            console.log('despues de dar alta al childprocess');
            //lo guardo con el id del ascensor para poder accederlo
            ascensoresProcesos[ascensor.id] = childProcess;
        })

    });

}

// REQUEST METODO POST (ALTA VISITANTE)
function altaAscensor(res,ascensor){
    fs.readFile(archivoAscensores, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({error:'Error interno del servidor'}));
            return;
        }
    
        const ascensores = JSON.parse(data);
        ascensor.id = uuidv1();
        console.log(ascensor);

        //creo el proceso hijo para el ascensor
        const childProcess = spawn('node', ['scriptAscensor.js',  JSON.stringify(ascensor)]);
        //lo guardo con el id del ascensor para poder accederlo
        ascensoresProcesos[ascensor.id] = childProcess;

        ascensores.push(ascensor);
    
        fs.writeFile(archivoAscensores, JSON.stringify(ascensores, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({error:'Error interno del servidor'}));
                return;
            }
    
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({message: 'Alta de ascensor exitosa'}));
        });
    });
}


// REQUEST METODO DELETE (UN VISITANTE POR ID)
function deleteAscensor(res, id) {
    fs.readFile(archivoAscensores, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({error:'Error interno del servidor'}));
          return
        }
    
        const ascensores = JSON.parse(data);
        console.log("id: ",id," length: ",id.length);
        const ascensorIndex = ascensores.findIndex(ascensor => ascensor.id === id)
    
        //busco el proceso  del ascensor 
        const childProcess = ascensoresProcesos[id];

        //verifico que se encontro tanto en el json como en ascensoresProcesos
        if (ascensorIndex !== -1 && childProcess) {
          //finalizo el proceso
          childProcess.kill();
          //elimino el proceso guardado en ascensoresProcesos
          delete ascensoresProcesos[id];
        
          ascensores.splice(ascensorIndex, 1); // Elimina el ascensor del arreglo
          console.log(`Visitante con ID ${id} eliminado.`);
    
          // Guarda el archivo JSON actualizado
          fs.writeFile(archivoAscensores, JSON.stringify(ascensores, null, 2), (err) => {
            if (err) {
              console.error(err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({error:'Error interno del servidor'}));
              return
            }
    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({message:`Ascensor con ID ${id} eliminado.`}));
          });
        } else {
          console.log(`Ascensor con ID ${id} no encontrado.`);
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({message:`Ascensor con ID ${id} no encontrado.`}));
        }
      })
}


// REQUEST METODO PUT (ACTUALIZAR DATOS VISITANTE POR ID)
function modificacionAscensor(res,id,nuevosDatos){
    fs.readFile(archivoAscensores, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({error:'Error interno del servidor'}));
          return
        }
    
        const ascensores = JSON.parse(data);

        const childProcess = ascensoresProcesos[id];

        let ascensor = ascensores.find(ascensor=> ascensor.id == id);

        //console.log('datos originales:',ascensor);
        //console.log('nuevos datos: ',nuevosDatos);
        //console.log('childprocess: ',childProcess);

        if(ascensor != undefined && childProcess){
            ascensor.nombre = nuevosDatos.nombre;
            ascensor.pisos = nuevosDatos.pisos;
            ascensor.estado = nuevosDatos.estado;

            console.log('datos actualizados:',ascensor);


            childProcess.kill();
            delete ascensoresProcesos[id];

            const nuevoChildProces = spawn('node', ['scriptAscensor.js',  JSON.stringify(ascensor)]);

            ascensoresProcesos[ascensor.id] = nuevoChildProces;

            fs.writeFile(archivoAscensores, JSON.stringify(ascensores, null, 2), (err) => {
                if (err) {
                  console.error(err);
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({error:'Error interno del servidor'}));
                  return
                }
        
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({message:`Visitante con ID ${id} actualizado.`}));
              });
        }
        else{
            res.writeHead(404,{'Content-Type':'application/json'}); 
            res.write(JSON.stringify({message:"Error, no se encuentra ese ascensor"})); 
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
    res.writeHead(404,{'Content-Type':'application/json'}); 
    res.write(JSON.stringify({message:"Error, no se encuentra la ruta en gestionAscensores"}));
    res.end();
}

function datosIncorrectos(res){
    res.writeHead(400,{'Content-Type':'application/json'});
    res.write(JSON.stringify({message:"Error en el formato de los datos"}));
    res.end();
}


//aca se van a ir guardando los procesos de cada ascensor
const ascensoresProcesos = {};

const server = http.createServer((req,res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    const{ url, method} = req;

    console.log(`URL: ${url} - METHOD: ${method}`);

    if (method === 'OPTIONS') {
        // Configura los encabezados CORS para permitir la solicitud desde el origen específico
        res.writeHead(200, {
          'Access-Control-Allow-Origin': 'http://127.0.0.1:5500', // Reemplaza con tu origen permitido
          'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT', // Reemplaza con los métodos permitidos
          'Access-Control-Allow-Headers': 'Content-Type', // Reemplaza con los encabezados permitidos
        });
        res.end();
    

    } else if(url.startsWith("/api/ascensores")){

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

server.listen(8001);

altaChildProcessDelJSON();


