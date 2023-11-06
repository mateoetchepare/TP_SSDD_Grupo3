const http = require('http');
const fs = require('fs');
const archivoVisitantes = __dirname + '/visitantes.json';
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

//probando nuevamente git

const schema = require('./esquema.json');

// Define una función de validación personalizada para fechas en formato ISO (cadenas)
function customISODateValidation(value) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(value);
}
  
// Registra el formato personalizado en Ajv
ajv.addFormat("custom-iso-date", customISODateValidation);

// REQUEST METODO PUT (ACTUALIZAR DATOS VISITANTE POR ID)
function modificacionVisitante(res,id,nuevosDatos){
    fs.readFile(archivoVisitantes, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({error:'Error interno del servidor'}));
          return
        }
    
        const visitantes = JSON.parse(data);


        let visitante = visitantes.find(visitante=> visitante.id == id);

        console.log('datos originales:',visitante);
        console.log('nuevos datos: ',nuevosDatos);

        if( visitante != undefined){
            visitante.nombre = nuevosDatos.nombre;
            visitante.edad = nuevosDatos.edad;
            visitante.email= nuevosDatos.email;
            visitante.pisos_permitidos = nuevosDatos.pisos_permitidos;
            visitante.fecha_checkIn = nuevosDatos.fecha_checkIn;
            visitante.fecha_checkOut = nuevosDatos.fecha_checkOut;

            console.log('datos actualizados:',visitante);

            fs.writeFile(archivoVisitantes, JSON.stringify(visitantes, null, 2), (err) => {
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
            res.write(JSON.stringify({message:"Error, no se encuentra ese visitante"}));   
        }

    })
}

// REQUEST METODO POST (ALTA VISITANTE)
function altaVisitante(res,visitante){
    fs.readFile(archivoVisitantes, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({error:'Error interno del servidor'}));
            return;
        }
    
        const visitantes = JSON.parse(data);

        //FALTA CREAR UNA FUNCIONPARA GENERAR EL ID
        visitante.id = generarSiguienteIdentificador(visitantes);
    
        visitantes.push(visitante);
    
        fs.writeFile(archivoVisitantes, JSON.stringify(visitantes, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({error:'Error interno del servidor'}));
                return;
            }
    
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({message: 'Alta de visitante exitosa'}));
        });
    });
}

function generarSiguienteIdentificador(visitantes) {
    // Encontrar el identificador más grande
    let maxId = 'A000'; // Inicializar con un valor base
  
    for (const visitante of visitantes) {
      const id = visitante.id;
      if (id >= maxId) {
        maxId = id;
      }
    }
  
    // Generar el siguiente identificador
    let prefix = maxId.charAt(0);
    let number = parseInt(maxId.slice(1));
  
    // Lógica para incrementar el número y cambiar la letra cuando sea necesario
    number++;
    if (number > 999) {
      number = 0;
      prefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
      if (prefix > 'Z') {
        // Si llegamos a 'Z', comenzamos con 'AA000'
        prefix = 'AA';
      }
    }
  
    const siguienteId = prefix + number.toString().padStart(3, '0');
  
    return siguienteId;
}
  

// REQUEST METODO DELETE (UN VISITANTE POR ID)
function deleteVisitante(res, id) {
    fs.readFile(archivoVisitantes, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({error:'Error interno del servidor'}));
          return
        }
    
        const visitantes = JSON.parse(data);
        
        const visitanteIndex = visitantes.findIndex(visitante => visitante.id === id)
    
        if (visitanteIndex !== -1) {
          visitantes.splice(visitanteIndex, 1); // Elimina el visitante del arreglo
          console.log(`Visitante con ID ${id} eliminado.`);
    
          // Guarda el archivo JSON actualizado
          fs.writeFile(archivoVisitantes, JSON.stringify(visitantes, null, 2), (err) => {
            if (err) {
              console.error(err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({error:'Error interno del servidor'}));
              return
            }
    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({message:`Visitante con ID ${id} eliminado.`}));
          });
        } else {
          console.log(`Visitante con ID ${id} no encontrado.`);
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({message:`Visitante con ID ${id} no encontrado.`}));
        }
      })
}
  
// REQUEST METODO GET (TODOS LOS VISITANTES)
function getVisitantes(res){
    fs.readFile(archivoVisitantes, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(JSON.stringify({error:'Error interno del servidor'}));
          return
        }
    
        const visitantes = JSON.parse(data);
        
        res.writeHead(200,{'Content-Type':'application/json'}); 
        res.write(JSON.stringify(visitantes)); 
        res.end();
    })

}

// REQUEST METODO GET (UN VISITANTE POR ID)
function getVisitante(res, id){

    fs.readFile(archivoVisitantes, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(JSON.stringify({error:'Error interno del servidor'}));
          return
        }
    
        const visitantes = JSON.parse(data);


        let visitante = visitantes.find(visitante=> visitante.id == id);

        if( visitante != undefined){
            res.writeHead(200,{'Content-Type':'application/json'});
            res.write(JSON.stringify(visitante));
        }
        else{
            res.writeHead(404,{'Content-Type':'application/json'}); 
            res.write(JSON.stringify({message:"Error, no se encuentra esa visitante"})); 
        }

        res.end()
    })
}

// REQUEST INCORRECTA
function rutaNoEncontrada(res){
    res.writeHead(404,{'Content-Type':'application/json'}); 
    res.write(JSON.stringify({message:"Error, no se encuentra la ruta en gestionVisitantes"})); 
    res.end();
}

function datosIncorrectos(res){
    res.writeHead(400,{'Content-Type':'application/json'});
    res.write(JSON.stringify({message:"Error en el formato de los datos"}));
    res.end();
}

function validacionDatos(visitante){

    const validate = ajv.compile(schema);
    const isValid = validate(visitante);

    return  isValid;

}


const server = http.createServer((req,res)=>{

    const{ url, method} = req;

    console.log(`URL: ${url} - METHOD: ${method}`);
    
    if(url.startsWith("/api/visitantes")){

        let parametros = url.split('/');
        parametros = parametros.filter(el => el != '');
        //console.log(parametros);

        if(method === 'GET'){   

            if(url ===  '/api/visitantes/lista'){ //devolver todos los visitantes

                console.log('request para devolver todos los visitantes');
                getVisitantes(res);

            }else if(url.startsWith('/api/visitantes/') && parametros.length === 3){ //devolver datos del visitante seleccioinado

                const visitanteId = parametros[2];
                console.log(`Request para devolver un visitante especificado (ID: ${visitanteId})`);

                getVisitante(res, visitanteId);
            }else{
                rutaNoEncontrada(res);
            }

        } else if(method === 'POST'){

            if(url === '/api/visitantes/alta'){ //crear nuevo visitante

                console.log('request para dar de alta a un visitante');

                let data = '';

                req.on('data', (chunk) => {
                    data += chunk;
                })

                req.on('end',()=>{
                    try{
                        console.log(data.length)
                        console.log(typeof data)
                        const nuevoVisitante = JSON.parse(data);
                        
                        console.log(nuevoVisitante);
                        console.log(nuevoVisitante.nombre);

                        //validacionDatos(nuevoVisitante);
                        if(validacionDatos(nuevoVisitante)){

                            //doy de alta
                            altaVisitante(res,nuevoVisitante);
                            console.log('se dio de alta el visitante')
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

            if(url.startsWith('/api/visitantes/') && parametros.length === 3){ //eliminar visitante seleccionado

                const visitanteId = parametros[2];
                console.log(`Request para dar de baja a un visitante (ID: ${visitanteId})`);
                deleteVisitante(res, visitanteId);

            }else{
                rutaNoEncontrada(res);
            }

        }else if(method === 'PUT'){

            if(url.startsWith('/api/visitantes/') && parametros.length === 3){ //modificar datos del visitante seleccionado

                const visitanteId = parametros[2];
                console.log(`Request para modificar un visitante especificado (ID: ${visitanteId})`);
                
                
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
                            modificacionVisitante(res,visitanteId,nuevosDatos);

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

server.listen(3501);//puerto de gestion visitantes



