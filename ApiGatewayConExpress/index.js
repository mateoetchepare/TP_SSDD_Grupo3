const { bodyParser } = require("./bodyParser");
const { application } = require("express");
const express = require("express");
const http = require("http");
const cors = require("cors");
//const path = require("url");
const puertoVisitantes = 8002;
const puertoAscensores = 8001;
const puertoPermisos = 8003;

const app = express();

// FALTA TODA LA PARTE DE AUTENTICACION

app.use( //FIJARSE SI ESTO FUNCIONA 
  cors({
    origin: "*",
  })
);

//RUTAS PARA VISISTANTES

app.route('/api/visitantes*') //despies de visitantes agrega un * ATENTO POR SI FALLA ESO

    .get((req, res) => {
        console.log(req.url);
        http.get("http://localhost:" + puertoVisitantes + req.url, (respuesta) => {
            let data = '';
            respuesta.on('data', (chunk) => {
                data += chunk;
            });
            respuesta.on('end', () => {
                res.status(respuesta.statusCode).json(JSON.parse(data));
                console.log('la data es: ', data)
            });
        })
            .on('error', (err) => {
                console.log(err.message);
                res.status(500).send(err.message);
            });

    })

    .post((req, res) => {

        bodyParser(req)
            .then(() => {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
        
                const request = http.request("http://localhost:" + puertoVisitantes + req.url,
                    options,
                    (response) => { //puede haber error aca
                        let body = '';
                        response.on('data', (chunk) => {
                            body += chunk;
                        });
        
                        response.on('end', () => {
                            res.status(response.statusCode).json(JSON.parse(body));
                        });
                    });
        
                request.write(JSON.stringify(req.body));
                request.end();
            }).catch((error) => console.error(error));

    })

    .delete((req, res) => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const request = http.request("http://localhost:" + puertoVisitantes + req.url,
            options,
            (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    res.status(response.statusCode).json(JSON.parse(data));
                });
            });

        request.end();
    })

    .put((req, res) => {

        bodyParser(req)
            .then(() => {

                const bodyData = req.body;

                const options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };

                const request = http.request("http://localhost:" + puertoVisitantes + req.url,
                    options,
                    (response) => {
                        let body = '';
                        response.on('data', (chunk) => {
                            body += chunk;
                        });
                        response.on('end', () => {
                            res.status(response.statusCode).json(JSON.parse(body));
                        });
                    });

                request.write(JSON.stringify(bodyData));
                request.end();

            }).catch((error) => console.error(error));

    });


//RUTAS PARA ASCENSORES

app.route('/api/ascensores*') //despies de visitantes agrega un * ATENTO POR SI FALLA ESO

    .get((req, res) => {
        console.log(req.url);
        http.get("http://localhost:" + puertoAscensores + req.url, (respuesta) => {
            let data = '';
            respuesta.on('data', (chunk) => {
                data += chunk;
            });
            respuesta.on('end', () => {
                res.status(respuesta.statusCode).json(JSON.parse(data));
                console.log('la data es: ', data)
            });
        })
            .on('error', (err) => {
                console.log(err.message);
                res.status(500).send(err.message);
            });

    })

    .post((req, res) => {

        bodyParser(req)
            .then(() => {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
        
                const request = http.request("http://localhost:" + puertoAscensores + req.url,
                    options,
                    (response) => { //puede haber error aca
                        let body = '';
                        response.on('data', (chunk) => {
                            body += chunk;
                        });
        
                        response.on('end', () => {
                            res.status(response.statusCode).json(JSON.parse(body));
                        });
                    });
        
                request.write(JSON.stringify(req.body));
                request.end();
            }).catch((error) => console.error(error));

    })

    .delete((req, res) => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const request = http.request("http://localhost:" + puertoAscensores + req.url,
            options,
            (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    res.status(response.statusCode).json(JSON.parse(data));
                });
            });

        request.end();
    })

    .put((req, res) => {

        bodyParser(req)
            .then(() => {

                const bodyData = req.body;

                const options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };

                const request = http.request("http://localhost:" + puertoAscensores + req.url,
                    options,
                    (response) => {
                        let body = '';
                        response.on('data', (chunk) => {
                            body += chunk;
                        });
                        response.on('end', () => {
                            res.status(response.statusCode).json(JSON.parse(body));
                        });
                    });

                request.write(JSON.stringify(bodyData));
                request.end();

            }).catch((error) => console.error(error));

    });


//RUTAS PARA PERMISOS

app.route('/api/permisos*') //despies de visitantes agrega un * ATENTO POR SI FALLA ESO

    .get((req, res) => {
        console.log(req.url);
        http.get("http://localhost:" + puertoPermisos + req.url, (respuesta) => {
            let data = '';
            respuesta.on('data', (chunk) => {
                data += chunk;
            });
            respuesta.on('end', () => {
                res.status(respuesta.statusCode).json(JSON.parse(data));
                console.log('la data es: ', data)
            });
        })
            .on('error', (err) => {
                console.log(err.message);
                res.status(500).send(err.message);
            });

    })
  
    .put((req, res) => {

        bodyParser(req)
            .then(() => {

                const bodyData = req.body;

                const options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };

                const request = http.request("http://localhost:" + puertoPermisos + req.url,
                    options,
                    (response) => {
                        let body = '';
                        response.on('data', (chunk) => {
                            body += chunk;
                        });
                        response.on('end', () => {
                            res.status(response.statusCode).json(JSON.parse(body));
                        });
                    });

                request.write(JSON.stringify(bodyData));
                request.end();

            }).catch((error) => console.error(error));

    });



app.listen(8005);
console.log("Server listening on port " + 8000);