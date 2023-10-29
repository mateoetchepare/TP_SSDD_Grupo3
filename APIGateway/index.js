const http = require('http');
const { bodyParser } = require('./bodyParser');
const url = require('url');
const puertoAscensores = 3502;

const server = http.createServer((req,res) => {
    

    const { url , method } = req;
    console.log(`URL: ${url} - METHOD: ${method}`);

    let param = url.split("/");

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

});

server.listen(3500); // puerto del APIRest