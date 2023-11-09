
const puertoAscensores = 3502;

const ascensores = [];

async function getAscensores () {
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
  });

function agregarAscensor() {
  const nuevoAscensor = {
    id: "",
    nombre: "",
    pisos: [],
    estado: ""
  };
  ascensores.push(nuevoAscensor);
}

function ultimoAscensor() {
  return ascensores[ascensores.length - 1];
}

function modificarAscensor(idAsc, nuevoNombre, pisosNuevos) {
  const indice = ascensores.findIndex(ascensor => ascensor.id === idAsc);
  console.log(indice);
  if (indice !== -1) {
    const ascensorModificado = {
      id: idAsc,
      nombre: nuevoNombre,
      pisos: pisosNuevos,
      estado: ascensores[indice].estado
    };
    ascensores[indice] = ascensorModificado;
    console.log(ascensorModificado.pisos);
  }
}

export { getAscensores, ultimoAscensor, agregarAscensor, modificarAscensor };