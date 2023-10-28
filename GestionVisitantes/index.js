const http = require('http')
const fs = require('fs')
const archivoVisitantes = __dirname + '/visitantes.json'



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
            }

        } else if(method === 'POST'){

            if(url === '/api/visitantes/alta'){ //crear nuevo visitante

                console.log('request para dar de alta a un visitante')

            }

        } else if(method === 'DELETE'){

            if(url.startsWith('/api/visitantes/') && parametros.length === 3){ //eliminar visitante seleccionado

                const visitanteId = parametros[2]
                console.log(`Request para dar de baja a un visitante (ID: ${visitanteId})`)
                deleteVisitante(res, visitanteId)

            }

        }else if(method === 'PUT'){

            if(url.startsWith('/api/visitantes/') && parametros.length === 3){ //modificar datos del visitante seleccionado

                const visitanteId = parametros[2]
                console.log(`Request para modificar un visitante especificado (ID: ${visitanteId})`)

            }
        }

        
        
    }else{
        console.log('no entro al if')
    }

    

    
})

server.listen(3501)//puerto de gestion visitantes

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*if(url.startsWith("/api/sucursales")){
        let parametros = url.split("/");
        console.log(parametros)
        parametros = parametros.filter(el => el != '')   //filtro los vacios
        console.log(parametros.length)
        console.log(parametros)
            if(parametros.length == 2){ // todas las sucursales
                //getSucursales(res)
            }
            if(parametros.length == 3){ // una unica suscursal
                //let idSucursal = parametros[2];
               // getSucursal(res,idSucursal)
    
            }    
    }*/

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // metodo POST para alta de un visitante
   /* if (method === 'POST'){
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

    }*/