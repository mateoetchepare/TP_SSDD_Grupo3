const http = require('http');

function sendDataSync(url, data) {
    const postData = JSON.stringify(data);

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api' + url, // Concatena la URL con la ruta base',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    const req = http.request(options);

    req.write(postData);
    req.end();

    return new Promise((resolve, reject) => {
        req.on('response', (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                console.log(responseData);
                resolve((responseData));
            });
        });

        req.on('error', (error) => {
            reject(error);
        });
    });
}

function getDataSync(url) {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api' + url, // Concatena la URL con la ruta base
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options);

    req.end();

    return new  Promise((resolve, reject) => {
        req.on('response', (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(responseData); // Resuelve la promesa con los datos recibidos
                  } else {
                    reject('Error ' + res.statusCode); // Rechaza la promesa en caso de error
                  }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });
    });
}

module.exports = {
    sendDataSync,
    getDataSync
};
