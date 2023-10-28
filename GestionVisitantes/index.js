const http = require('http')
const fs = require('fs')
const archivoVisitantes = __dirname + '/visitantes.json'
const Ajv = require('ajv')

const schema = require('./esquema.json')


// REQUEST METODO DELETE (UN VISITANTE POR ID)
function deleteVisitante(res, id) {
    fs.readFile(archivoVisitantes, 'utf8', (err, data) => {
        if (err) {
          console.error(err)
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          res.end('Error interno del servidor')
          return
        }
    
        const visitantes = JSON.parse(data)
        
        const visitanteIndex = visitantes.findIndex(visitante => visitante.id === id)
    
        if (visitanteIndex !== -1) {
          visitantes.splice(visitanteIndex, 1) // Elimina el visitante del arreglo
          console.log(`Visitante con ID ${id} eliminado.`)
    
          // Guarda el archivo JSON actualizado
          fs.writeFile(archivoVisitantes, JSON.stringify(visitantes, null, 2), (err) => {
            if (err) {
              console.error(err)
              res.writeHead(500, { 'Content-Type': 'text/plain' })
              res.end('Error interno del servidor')
              return
            }
    
            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end(`Visitante con ID ${id} eliminado.`)
          });
        } else {
          console.log(`Visitante con ID ${id} no encontrado.`)
          res.writeHead(404, { 'Content-Type': 'text/plain' })
          res.end(`Visitante con ID ${id} no encontrado.`)
        }
      })
}
  
// REQUEST METODO GET (TODOS LOS VISITANTES)
function getVisitantes(res){
    fs.readFile(archivoVisitantes, 'utf8', (err, data) => {
        if (err) {
          console.error(err)
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          res.end('Error interno del servidor')
          return
        }
    
        const visitantes = JSON.parse(data);
        
        res.writeHead(200,{'Content-Type':'application/json'})// devuelvo json
        res.write(JSON.stringify(visitantes)) // envio las visitantes
        res.end()
    })

}

// REQUEST METODO GET (UN VISITANTE POR ID)
function getVisitante(res, id){

    fs.readFile(archivoVisitantes, 'utf8', (err, data) => {
        if (err) {
          console.error(err)
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          res.end('Error interno del servidor')
          return
        }
    
        const visitantes = JSON.parse(data)


        let visitante = visitantes.find(visitante=> visitante.id == id)

        if( visitante != undefined){
            res.writeHead(200,{'Content-Type':'application/json'})
            res.write(JSON.stringify(visitante))
        }
        else{
            res.writeHead(404,{'Content-Type':'application/json'}) // devuelvo json
            res.write("Error, no se encuentra esa visitante") // envio la sucursal  
        }

        res.end()
    })
}

// REQUEST INCORRECTA
function rutaNoEncontrada(res){
    res.writeHead(404,{'Content-Type':'application/json'}) // devuelvo json
    res.write("Error, no se encuentra la ruta en gestionVisitantes") // envio la sucursal  
    res.end()
}

function datosIncorrectos(res){
    res.writeHead(404,{'Content-Type':'text/plain'}) 
    res.write("Error en el formato de los datos") 
    res.end()
}

function validacionDatos(visitante){

    const ajv = new Ajv()

    

    console.log('estoy dentro  de validacion de datos')
    const validate = ajv.compile(schema)
    console.log('pase el compile')
    const isValid = validate(visitante)
    console.log(isValid)
    if(isValid)
        console.log('los datos aportados son validos')
    else
        console.log('los datos aportados no son validos')
    return  isValid

}

const server = http.createServer((req,res)=>{

    const{ url, method} = req

    console.log(`URL: ${url} - METHOD: ${method}`)
    
    if(url.startsWith("/api/visitantes")){

        let parametros = url.split('/')
        parametros = parametros.filter(el => el != '')
        //console.log(parametros)

        if(method === 'GET'){   

            if(url ===  '/api/visitantes/lista'){ //devolver todos los visitantes

                console.log('request para devolver todos los visitantes')
                getVisitantes(res)

            }else if(url.startsWith('/api/visitantes/') && parametros.length === 3){ //devolver datos del visitante seleccioinado

                const visitanteId = parametros[2]
                console.log(`Request para devolver un visitante especificado (ID: ${visitanteId})`)

                getVisitante(res, visitanteId)
            }else{
                rutaNoEncontrada(res)
            }

        } else if(method === 'POST'){

            if(url === '/api/visitantes/alta'){ //crear nuevo visitante

                console.log('request para dar de alta a un visitante')

                let data = ''

                req.on('data', (chunk) => {
                    data += chunk
                })

                req.on('end',()=>{
                    try{
                        const nuevoVisitante = JSON.parse(data)
                        
                        console.log(nuevoVisitante)
                        console.log(nuevoVisitante.nombre)

                        validacionDatos(nuevoVisitante)
                        /*if(validacionDatos(nuevoVisitante)){

                            //doy de alta

                        }else{
                            datosIncorrectos(res)
                        }*/

                    }catch(error){
                        datosIncorrectos(res)
                    }

                })
            }
            else{
                rutaNoEncontrada(res)
            }

        } else if(method === 'DELETE'){

            if(url.startsWith('/api/visitantes/') && parametros.length === 3){ //eliminar visitante seleccionado

                const visitanteId = parametros[2]
                console.log(`Request para dar de baja a un visitante (ID: ${visitanteId})`)
                deleteVisitante(res, visitanteId)

            }else{
                rutaNoEncontrada(res)
            }

        }else if(method === 'PUT'){

            if(url.startsWith('/api/visitantes/') && parametros.length === 3){ //modificar datos del visitante seleccionado

                const visitanteId = parametros[2]
                console.log(`Request para modificar un visitante especificado (ID: ${visitanteId})`)

            }else{
                rutaNoEncontrada(res)
            }
        }

        
        
    }else{

        rutaNoEncontrada(res)
    
    }

    

    
})

server.listen(3501)//puerto de gestion visitantes

