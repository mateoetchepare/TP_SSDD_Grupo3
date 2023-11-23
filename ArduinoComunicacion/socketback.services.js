const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8085 });

const port = new SerialPort({
  path: 'COM4',
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
});


const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' })); 

let clienteWebSocket = null;

server.on('connection', (socket) => {
  console.log('Cliente conectado');
  clienteWebSocket = socket;
  // Manejar mensajes recibidos del cliente
  socket.on('message', (IDVisitante) => {           //EL UNICO DATO Q RECIBE DEL CLIENTE ES EL IDVISITANTE
        //let StringID = '"' + IDVisitante + '"';
        const jsonData = [
          {
          "id": "1234f6a4-564a-4511-b96c-0e9fa114abcd", 
          "type": 1, 
          "owner_id": ""+IDVisitante, 
          "serial_number": "123" 
          }
          ];
         
        
        port.write(JSON.stringify(jsonData) + '\n', (err) => {
          if (err) {
            console.log("error al enviar datos");
            socket.send('Error al enviar datos');
          }
          console.log('Envio de datos a Arduino exitoso');
          socket.send('Envio de datos a Arduino exitoso');
        });
        
      });

  });

  // Manejar cierre de conexión
  //socket.on('close', () => {
  //  console.log('Cliente desconectado');
  //});

  // Enviar un mensaje al cliente después de un tiempo de espera (por ejemplo, 5 segundos)

console.log('Servidor WebSocket iniciado en el puerto 8085');


        
parser.on('data', (data) => {
  console.log("Mensaje Recibido del arduino: "+data.toString());
  if(data.toString() === "Escritura exitosa"){ //CASO DONDE SE ESCRIBE EN LA TARJETA
    console.log("Escritura exitosa");
    if (clienteWebSocket) {
        clienteWebSocket.send('Escritura exitosa');
    }
  }
    else{ 
      //console.log(data.toString().length);
      if (data.toString().length == 32){ //CASO DONDE SE LEE DE LA TARJETA 
        console.log("Lectura exitosa");
        const subcadena = data.toString().substring(6, 14);
        console.log(subcadena);
        console.log(convertirASCIIAString(subcadena));
        if (clienteWebSocket){
            clienteWebSocket.send(convertirASCIIAString(subcadena));
        }
        //caso lectura exitosa
      }

      else{
        console.log("Error al grabar / leer la tarjeta");
        if (clienteWebSocket){
            clienteWebSocket.send('Error al grabar / leer la tarjeta');
        }
      }

    }
});


port.on('open', () => {
  console.log('Conexión establecida con el puerto serial');
});



// Manejo de errores
port.on('error', (err) => {
  console.error('Error en el puerto serial:', err.message);
});


function convertirASCIIAString(subcadena) {
  // Dividir la subcadena en pares de caracteres
  const pares = subcadena.match(/.{1,2}/g);

  // Convertir cada par a su valor ASCII y luego a su carácter
  const caracteres = pares.map(par => String.fromCharCode(parseInt(par, 16)));

  // Concatenar los caracteres en una cadena
  const resultado = caracteres.join('');

  return resultado;
}