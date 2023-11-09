
const puertoAscensores = 3502;

let ascensores = [];

async function getAscensores() {
  const url = `http://localhost:${puertoAscensores}/api/ascensores/lista`; // Ajusta la URL de la API Gateway
  try {
    const response = await fetch(url);
    if (response.ok) {
      const jsonResponse = await response.json(); // Parsea la respuesta JSON
      console.log()
      return jsonResponse;
    } else {
      throw new Error(`Error al obtener ascensores. Código de estado: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

getAscensores()
  .then(JsonParseado => {
    ascensores = JsonParseado;
    console.log(ascensores);
  });

function agregarAscensor() {
  const nuevoAscensor = {
    id: "", // hacer nuevo id con UUID (falta)
    nombre: "",
    pisos: [],
    estado: ""
  };
  return nuevoAscensor;
}

function ultimoAscensor() {
  return ascensores[ascensores.length - 1];
}

function existeAscensor(idAscensor) {
  const indice = ascensores.findIndex(ascensor => ascensor.id === idAscensor);
  return indice !== -1;
}

function modificarAscensor(idAsc, nuevoNombre, pisosNuevos) {
  const indice = ascensores.findIndex(ascensor => ascensor.id === idAsc);
  const ascensorModificado = {
    id: idAsc,
    nombre: nuevoNombre,
    pisos: pisosNuevos,
    estado: 'Disponible'
  };
  console.log(indice);
  if (indice !== -1) { // existe entonces hay que modificarlo nomas con un PUT
    const success = llamadaGateway(ascensorModificado, `ascensores/${ascensorModificado.id}`, 'PUT', `${puertoAscensores}`);
    if (success) {
      ascensores[indice] = ascensorModificado;
    }
  } else { // NO existe entonces hay que crearlo
    const success = llamadaGateway(ascensorModificado, `ascensores/alta`, 'POST', `${puertoAscensores}`);
    if (success) {
      ascensores.push(nuevoAscensor);
    }
  }
}

function llamadaGateway(ascensorModificado, url, tipoMetodo, puerto) {
  const success = 0;
  console.log(JSON.stringify(ascensorModificado));
  const apiUrl = `http://localhost:${puerto}/api/${url}`; // Ajusta la URL de la API Gateway según tu configuración
  const requestOptions = {
    method: `${tipoMetodo}`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ascensorModificado),
  };

  fetch(apiUrl, requestOptions)
    .then(response => {
      if (response.status === 200) {
        console.log(' se guardaron los cambios del ascensor ');
        success = 1;
      } else {
        // Manejar otros códigos de estado o errores aquí
        console.log(' NO se guardaron los cambios del ascensor ');
        console.error('Error al agregar el visitante. Código de estado: ', response.status);
      }
    })
    .catch(error => {
      console.log(' NO se guardaron los cambios del ascensor ');
      console.error('Error de red al agregar el visitante: ', error);
    });
  return success;
}

export { getAscensores, ultimoAscensor, agregarAscensor, modificarAscensor, existeAscensor };