const http = require('http');
const { bodyParser } = require('./bodyParser');
const url = require('url');
const puertoVisitantes = 8002;
const puertoAscensores = 8001;
const puertoPermisos = 8003;

const server = http.createServer((req,res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    const { url , method } = req;
    console.log(`URL: ${url} - METHOD: ${method}`);

    let param = url.split("/"); //chequear que este bien spliteado

    //METODO OPTIONS

    if (method === 'OPTIONS') {
        // Configura los encabezados CORS para permitir la solicitud desde el origen específico
        res.writeHead(200, {
          'Access-Control-Allow-Origin': 'http://127.0.0.1:5500', // Reemplaza con tu origen permitido
          'Access-Control-Allow-Methods': 'POST, GET, DELETE, PUT', // Reemplaza con los métodos permitidos
          'Access-Control-Allow-Headers': 'Content-Type', // Reemplaza con los encabezados permitidos
        });
        res.end();

    }

    // VISITANTES
    if(url.startsWith("/api/visitantes")){
        switch(method){
            case "GET":
                http.get("http://localhost:" + puertoVisitantes + url,
                (respuesta) =>{
                    let data = "";
                    respuesta.on("data", (chunk) => {
                        data += chunk;
                    });
                    respuesta.on("end", () => {
                        res.writeHead(respuesta.statusCode, {
                            "Content-Type": "application/json",
                        });
                        console.log('la data es: ',data)
                        //data = JSON.parse(data);
                        //res.write(JSON.stringify(data));
                        res.write(data)
                        res.end();
                    });
                })
                .on("error", (err) => {
                    console.log(err.message);
                })

                break;
            
            case "POST":
                bodyParser(req)
                    .then(() => {

                        const bodyData = req.body;

                        const options = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            }
                        };
                    
                        const request = http.request("http://localhost:" + puertoVisitantes + url, 
                        options,
                        function(response){
                            let body = "";

                            response.on("data", (chunk) => {
                                body += chunk;
                            });

                            response.on("end", () => {
                                res.writeHead(response.statusCode,{
                                    "Content-Type": "application/json",
                                });
                                console.log('el body es: ',body)
                                //body = JSON.parse(body);
                                //res.write(JSON.stringify(body));
                                res.write(body)
                                res.end();
                            });

                            response.on("close", () => {
                                console.log("Connection closed Visitantes.");
                            })

                        });

                        request.write(JSON.stringify(bodyData));
                        request.end();
                
                    }).catch((error) => console.error(error));

                break;
            
            case "DELETE":
                const options = {
                    method: "DELETE",
                    headers:{
                        "Content-Type": "application/json"//,
                       // "Content-Length": Buffer.byteLength(req.body),
                    },
                };

                const request = http.request("http://localhost:" + puertoVisitantes + url,
                options,
                function(response){
                    let data = "";
                    response.on("data", (chunk) => {
                        data += chunk;
                    });

                    response.on("end", () => {
                        res.writeHead(response.statusCode,{
                            "Content-Type": "application/json",
                        });
                        //data = JSON.parse(data);
                        //res.write(JSON.stringify(data));
                        res.write(data)
                        res.end();
                    });

                    response.on("close", () => {
                        console.log("Connection closed Visitantes.")
                    });
                })
                
                request.end();
                break;

            case "PUT": //a chequear
                bodyParser(req)
                .then(() => {

                    const bodyData = req.body;

                    const options = {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    };
            
                    const request = http.request("http://localhost:" + puertoVisitantes + url, 
                    options,
                    function(response){
                        let body = "";

                        response.on("data", (chunk) => {
                            body += chunk;
                        });

                        response.on("end", () => {
                            res.writeHead(response.statusCode,{
                                "Content-Type": "application/json",
                            });
                            console.log('el body es: ',body)
                            //body = JSON.parse(body);
                            //res.write(JSON.stringify(body));
                            res.write(body)
                            res.end();
                        });

                        response.on("close", () => {
                            console.log("Connection closed Visitantes.");
                        })

                    });

                    request.write(JSON.stringify(bodyData));
                    request.end();
        
                }).catch((error) => console.error(error));

            break;   

        }
    }


    //ASCENSORES
    if(url.startsWith("/api/ascensores")){
        switch(method){
            case "GET":
                http.get("http://localhost:" + puertoAscensores + url,
                (respuesta) =>{
                    let data = "";
                    respuesta.on("data", (chunk) => {
                        data += chunk;
                    });
                    respuesta.on("end", () => {
                        res.writeHead(respuesta.statusCode, {
                            "Content-Type": "application/json",
                        });
                        console.log('la data es: ',data)
                        //data = JSON.parse(data);
                        //res.write(JSON.stringify(data));
                        res.write(data)
                        res.end();
                    });
                })
                .on("error", (err) => {
                    console.log(err.message);
                })

                break;
            
            case "POST":
                bodyParser(req)
                    .then(() => {

                        const bodyData = req.body;

                        const options = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            }
                        };
                    
                        const request = http.request("http://localhost:" + puertoAscensores + url, 
                        options,
                        function(response){
                            let body = "";

                            response.on("data", (chunk) => {
                                body += chunk;
                            });

                            response.on("end", () => {
                                res.writeHead(response.statusCode,{
                                    "Content-Type": "application/json",
                                });
                                console.log('el body es: ',body)
                                //body = JSON.parse(body);
                                //res.write(JSON.stringify(body));
                                res.write(body)
                                res.end();
                            });

                            response.on("close", () => {
                                console.log("Connection closed Ascensores.");
                            })

                        });

                        request.write(JSON.stringify(bodyData));
                        request.end();
                
                    }).catch((error) => console.error(error));

                break;
            
            case "DELETE":
                const options = {
                    method: "DELETE",
                    headers:{
                        "Content-Type": "application/json"//,
                       // "Content-Length": Buffer.byteLength(req.body),
                    },
                };

                const request = http.request("http://localhost:" + puertoAscensores + url,
                options,
                function(response){
                    let data = "";
                    response.on("data", (chunk) => {
                        data += chunk;
                    });

                    response.on("end", () => {
                        res.writeHead(response.statusCode,{
                            "Content-Type": "application/json",
                        });
                        //data = JSON.parse(data);
                        //res.write(JSON.stringify(data));
                        res.write(data)
                        res.end();
                    });

                    response.on("close", () => {
                        console.log("Connection closed Ascensores.")
                    });
                })
                
                request.end();
                break;

            case "PUT":
                bodyParser(req)
                .then(() => {

                    const bodyData = req.body;

                    const options = {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    };
            
                    const request = http.request("http://localhost:" + puertoAscensores + url, 
                    options,
                    function(response){
                        let body = "";

                        response.on("data", (chunk) => {
                            body += chunk;
                        });

                        response.on("end", () => {
                            res.writeHead(response.statusCode,{
                                "Content-Type": "application/json",
                            });
                            console.log('el body es: ',body)
                            //body = JSON.parse(body);
                            //res.write(JSON.stringify(body));
                            res.write(body)
                            res.end();
                        });

                        response.on("close", () => {
                            console.log("Connection closed Ascensores.");
                        })

                    });

                    request.write(JSON.stringify(bodyData));
                    request.end();
        
                }).catch((error) => console.error(error));

            break;   

        }
    }


    //PERMISOS
    if(url.startsWith("/api/permisos")){
        switch(method){
            case "GET":
                http.get("http://localhost:" + puertoPermisos + url,
                (respuesta) =>{
                    let data = "";
                    respuesta.on("data", (chunk) => {
                        data += chunk;
                    });
                    respuesta.on("end", () => {
                        res.writeHead(respuesta.statusCode, {
                            "Content-Type": "application/json",
                        });
                        console.log('la data es: ',data)
                        //data = JSON.parse(data);
                        //res.write(JSON.stringify(data));
                        res.write(data)
                        res.end();
                    });
                })
                .on("error", (err) => {
                    console.log(err.message);
                })

                break;


            case "PUT":
                bodyParser(req)
                .then(() => {

                    const bodyData = req.body;

                    const options = {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    };
            
                    const request = http.request("http://localhost:" + puertoPermisos + url, 
                    options,
                    function(response){
                        let body = "";

                        response.on("data", (chunk) => {
                            body += chunk;
                        });

                        response.on("end", () => {
                            res.writeHead(response.statusCode,{
                                "Content-Type": "application/json",
                            });
                            console.log('el body es: ',body)
                            //body = JSON.parse(body);
                            //res.write(JSON.stringify(body));
                            res.write(body)
                            res.end();
                        });

                        response.on("close", () => {
                            console.log("Connection closed Permisos.");
                        })

                    });

                    request.write(JSON.stringify(bodyData));
                    request.end();
        
                }).catch((error) => console.error(error));

            break;  


        }

    }


});




server.listen(8000); // puerto del APIRest