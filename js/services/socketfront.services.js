const socket = new WebSocket('ws://localhost:8085');

let VisitanteAResaltar = null;

// Manejar eventos de conexión
socket.addEventListener('open', (event) => {
  console.log('Conexión establecida con el servidor');
});

// Manejar eventos de mensajes recibidos
socket.addEventListener('message', (event) => {
  
  //console.log('Mensaje del servidor:', event.data);

  if (event.data == "Envio de datos a Arduino exitoso"){
    console.log("Envio de datos a Arduino exitoso");
  }
  else if (event.data == "Escritura exitosa"){
    console.log("Escritura exitosa");
    alert("Escritura exitosa en tarjeta. Visitante "+ VisitanteAResaltar);
    resaltaVisitanteGrabado(VisitanteAResaltar);

  }
  else{ //SE RECIBE EL ID DEL VISITANTE DE LA TARJETA
    console.log("ID del visitante en la tarjeta RFID: ", event.data);
    resaltaVisitanteDueno(event.data);
  }
});

// Manejar eventos de cierre de conexión
//
//socket.addEventListener('close', (event) => {
//  console.log('Conexión cerrada con el servidor');
//});

// Enviar datos al servidor
function enviarDatosaArduino(IDVisitante) {
  console.log("mensaje a enviar al server", IDVisitante);
  socket.send(IDVisitante);
  VisitanteAResaltar=IDVisitante;
}

function resaltaVisitanteGrabado(IDVisitante){
    
  const elemento = document.querySelector(`#visitante-${IDVisitante}`);
  if (!elemento) {
      window.alert("La tarjeta RFID no pertenece a ningun Visitante");
  }
  else{
      elemento.classList.add("resaltarElemento");
      setTimeout(() => {
          elemento.classList.remove("resaltarElemento");
      }, 4000);
  }
}

function resaltaVisitanteDueno(IDVisitante){
    
  const elemento = document.querySelector(`#visitante-${IDVisitante}`);
  if (!elemento) {
      window.alert("La tarjeta RFID no pertenece a ningun Visitante");
  }
  else{
      elemento.classList.add("resaltarElemento");
      setTimeout(() => {
          elemento.classList.remove("resaltarElemento");
      }, 4000);
  }
}

export { enviarDatosaArduino };