const puertoVisitantes = 3501;
const puertoPermisos = 3503;
let visitantes = [];

async function getVisitantes() {
  const url = `http://localhost:${puertoVisitantes}/api/visitantes/lista`; // Ajusta la URL de la API Gateway
  try {
    const response = await fetch(url);
    if (response.ok) {
      const jsonResponse = await response.json(); // Parsea la respuesta JSON
      console.log()
      return jsonResponse;
    } else {
      throw new Error(`Error al obtener visitantes. Código de estado: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Llama a la función para obtener los visitantes
getVisitantes()
  .then(JsonParseado => {
    visitantes = JsonParseado;
  });


function agregarVisitante() {
  const idUltimo = visitantes[visitantes.length - 1].id;
  const nuevoID = siguienteID(idUltimo);
  const nuevoVisitante = {
    id: `${nuevoID}`,
    nombre: "",
    edad: 0,
    email: "",
    pisos_permitidos: [],
    fecha_checkIn: "",
    fecha_checkOut: "",
  };
  return nuevoVisitante;
}




function modificarInfoVisitantes(idVisit, nombreVisit, edadVisit, emailVisit, fechaVisitIn, fechaVisitOut) {
  const indice = visitantes.findIndex(visitante => visitante.id === idVisit);
  const visitanteModificado = {
    id: idVisit,
    nombre: nombreVisit,
    edad: edadVisit,
    pisos_permitidos: [],
    email: emailVisit,
    fecha_checkIn: fechaVisitIn,
    fecha_checkOut: fechaVisitOut
  }
  console.log(visitanteModificado);
  if (indice !== -1) { // el visitante existe entonces lo modifico nada mas con un PUT
    llamadaGateway(visitanteModificado, `visitantes/${visitanteModificado.id}`, 'PUT', `${puertoVisitantes}`);
    //visitantes[indice] = visitanteModificado;
    
  } else { // el visitante no existia entonces hago un POST
    // Realiza una solicitud POST a la API Gateway
    llamadaGateway(visitanteModificado, 'visitantes/alta', 'POST', puertoVisitantes);
    // añadir al vector local
  }
}

function llamadaGateway(visitanteModificado, url, tipoMetodo, puerto) {
  console.log(JSON.stringify(visitanteModificado));
  const apiUrl = `http://localhost:${puerto}/api/${url}`; // Ajusta la URL de la API Gateway según tu configuración
  const requestOptions = {
    method: `${tipoMetodo}`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(visitanteModificado), 
  };

  fetch(apiUrl, requestOptions)
    .then(response => {
      if (response.status === 200) {
        // La solicitud se completó con éxito
        console.log('Nuevo visitante agregado con éxito.');
      } else {
        // Manejar otros códigos de estado o errores aquí
        console.error('Error al agregar el visitante. Código de estado: ', response.status);
      }
    })
    .catch(error => {
      console.error('Error de red al agregar el visitante: ', error);
    });
}


function modificarPermisosVisitantes(idVisit, nuevosPisosPermitidos) {
  const indice = visitantes.findIndex(visitante => visitante.id === idVisit);
  if (indice !== -1) {
    llamadaGateway(nuevosPisosPermitidos, `permisos/${idVisit}`, 'PUT', `${puertoPermisos}`);
  }
}

function existeVisitante(idVisit) {
  const indice = visitantes.findIndex(visitante => visitante.id === idVisit);
  return indice !== -1;
}

function ultimoVisitante() {
  return visitantes[visitantes.length - 1];
}

function siguienteID(ultimoID) {
  const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let match = ultimoID.match(/([A-Z]+)(\d+)/);

  if (match) {
    const parteAlfabetica = match[1];
    let numero = parseInt(match[2], 10);

    if (!isNaN(numero)) {
      numero++; // Incrementar el número en 1

      // Verificar si el número supera 999
      if (numero > 999) {
        const parteAlfabeticaIndex = alfabeto.indexOf(parteAlfabetica);
        if (parteAlfabeticaIndex >= 0) {
          parteAlfabetica = alfabeto[parteAlfabeticaIndex + 1]; // Pasar a la siguiente letra del alfabeto
          numero = 1; // Restablecer el número a 1
        }
      }

      // Formatear el número como cadena con ceros a la izquierda
      const numeroFormateado = numero.toString().padStart(3, '0');
      return `${parteAlfabetica}${numeroFormateado}`;
    }
  }

  // Si el formato no coincide, devolver el último ID sin cambios
  return ultimoID;
}


export { getVisitantes, agregarVisitante, ultimoVisitante, modificarInfoVisitantes, modificarPermisosVisitantes, existeVisitante };

