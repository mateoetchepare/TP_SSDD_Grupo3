const http = require('http');
const { bodyParser } = require('./bodyParser');
const url = require('url');
const puertoVisitantes = 3501;
const puertoAscensores = 3502;
const puertoPermisos = 3503;

const server = http.createServer((req,res) => {
    

    const { url , method } = req;
    console.log(`URL: ${url} - METHOD: ${method}`);

    let param = url.split("/"); //chequear que este bien spliteado

    if(url.startsWith("/ascensores")){
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
                        data = JSON.parse(data);
                        res.write(JSON.stringify(data));
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
                        const options = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        };
                    
                        const request = http.request("http://localhost:" + puertoAscensores + url, 
                        options,
                        function(response){
                            let body = "";

                            response.on("data", (chunk) => {
                                body += chunk;
                            });

                            response.on("end", () => {
                                res.writehead(response.statusCode,{
                                    "Content-Type": "application/json",
                                });
                                body = JSON.parse(body);
                                res.write(JSON.stringify(body));
                                res.end();
                            });

                            response.on("close", () => {
                                console.log("Connection closed");
                            })

                        });

                        if(param[1] == ""){ //hay que definir la interfaz

                        }
                
                
                    })
            
            //case "DELETE":

            //case "PUT":
        }
    }

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
                        const options = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
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
                                body = JSON.parse(body);
                                res.write(JSON.stringify(body));
                                res.end();
                            });

                            response.on("close", () => {
                                console.log("Connection closed.");
                            })

                        });

                        //request.write(bodyData);
                        request.end();
                
                    }).catch((error) => console.error(error));

                    

                break;
            
            case "DELETE":
                bodyParser(req) //OJO ACA, VER BIEN
                    .then(() => {
                        /*payload = JSON.stringify({
                            userID: req.body.userID, 
                        });*/
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
                            let body = "";

                            response.on("data", (chunk) => {
                                body += chunk;
                            });

                            response.on("end", () => {
                                res.writeHead(response.statusCode,{
                                    "Content-Type": "application/json",
                                });
                                body = JSON.parse(body);
                                res.write(JSON.stringify(body));
                                res.end();
                            });

                            response.on("close", () => {
                                console.log("Connection closed.")
                            });

                        })

                        //request.write(payload);
                        //request.write();
                        request.end();
                    }).catch((error) => console.error(error));

                break;

            case "PUT": //a chequear
                bodyParser(req) //OJO ACA, VER BIEN
                    .then(() => {
                        /*payload = JSON.stringify({
                            userID: req.body.userID,
                        });*/
                        const options = {
                            method: "PUT",
                            headers:{
                                "Content-Type": "application/json",
                                //"Content-Length": Buffer.byteLength(req.body),
                            },
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
                                body = JSON.parse(body);
                                res.write(JSON.stringify(body));
                                res.end();
                            });

                            response.on("close", () => {
                                console.log("Connection closed.")
                            });

                        })

                        //request.write(payload);
                        request.end();
                    }).catch((error) => console.error(error));

                break;

        }
    }

});

server.listen(3500); // puerto del APIRest