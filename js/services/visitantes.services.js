
let visitantes = [
  {
    id: "A001",
    nombre: "Carlos Pérez",
    edad: 30,
    email: "carlos@gmail.com",
    pisos_permitidos: [1, 3, 5],
    fecha_checkIn: "2023-09-13T23:09:40.880Z",
    fecha_checkOut: "2023-09-15T23:09:40.880Z",
  },
  {
    id: "A002",
    nombre: "Ana García",
    edad: 28,
    email: "ana@gmail.com",
    pisos_permitidos: [1, 2, 4],
    fecha_checkIn: "2001-02-10",
    fecha_checkOut: "2001-01-16",
  },
  {
    id: "A003",
    nombre: "Luis Rodríguez",
    edad: 35,
    email: "luis@gmail.com",
    pisos_permitidos: [1, 3, 6],
    fecha_checkIn: "2007-05-11",
    fecha_checkOut: "2007-09-12",
  },
  {
    id: "A004",
    nombre: "María López",
    edad: 27,
    email: "maria@gmail.com",
    pisos_permitidos: [1, 2, 7],
    fecha_checkIn: "2001-04-19",
    fecha_checkOut: "2001-04-21",
  },
  {
    id: "A005",
    nombre: "Juan Martínez",
    edad: 32,
    email: "juan@gmail.com",
    pisos_permitidos: [1, 3, 8],
    fecha_checkIn: "2005-03-15",
    fecha_checkOut: "2005-03-18",
  },
];


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
    visitantes[indice] = visitanteModificado;
    //hacer PUT
  } else { // el visitante no existia entonces hago un POST
    // Realiza una solicitud POST a la API Gateway
    console.log(JSON.stringify(visitanteModificado));
    const apiUrl = 'http://localhost:3501/api/visitantes/alta'; // Ajusta la URL de la API Gateway según tu configuración
    const requestOptions = {
      method: 'POST',
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
      // visitantes.push(visitanteModificado); // ESTO ESTA MAL PORQUE LO TENDRIA QUE BAJAR DEL BACK
  }
}


function modificarPermisosVisitantes(idVisit, nuevosPisosPermitidos) {
  const indice = visitantes.findIndex(visitante => visitante.id === idVisit);
  console.log(indice);
  if (indice !== -1) {
    const visitanteModificado = {
      id: visitantes[indice].id,
      nombre: visitantes[indice].nombre,
      edad: visitantes[indice].edad,
      pisos_permitidos: nuevosPisosPermitidos,
      email: visitantes[indice].email,
      fecha_checkIn: visitantes[indice].fecha_checkIn,
      fecha_checkOut: visitantes[indice].fechaVisitOut
    }
    visitantes[indice] = visitanteModificado;
    console.log(visitantes[indice]);
  }
}

function existeVisitante(idVisit) {
  const indice = visitantes.findIndex(visitante => visitante.id === idVisit);
  return indice !== -1;
}

function ultimoVisitante() {
  return visitantes[visitantes.length - 1];
}

const getVisitantes = async () => {
  return visitantes;
};

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

