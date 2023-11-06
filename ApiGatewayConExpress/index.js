const { bodyParser } = require("./bodyParser");
const { application } = require("express");
const express = require("express");
const http = require("http");
const path = require("url");
const puertoVisitantes = 3501;
const puertoAscensores = 3502;
const puertoPermisos = 3503;

const app = express();

// FALTA TODA LA PARTE DE AUTENTICACION

//RUTAS PARA VISISTANTES

app.route('/api/visitantes') //despies de visitantes agrega un * ATENTO POR SI FALLA ESO
    .get((req, res) => {
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
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const request = http.request("http://localhost:" + puertoVisitantes + requrl,
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

        request.write(JSON.stringify(req.body));
        request.end();
    });



app.listen(8005);
console.log("Server listening on port " + 8005);