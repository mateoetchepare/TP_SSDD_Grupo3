
    const ascensores = [ //Datos para probar el front
        {
          id: "7408f6a4-564a-4511-b96c-0e9fa114e9c5",
          nombre: "A",
          pisos: [1, 3, 5],
          estado: "Disponible"
        },
        {
          id: "fbcda1e1-4a88-4e34-b62c-1a0d9b2d49a2",
          nombre: "B",
          pisos: [4, 6],
          estado: "Disponible"
        },
        {
          id: "adf2b82c-9a19-4ce7-b9d2-3ff0dbf4d7f9",
          nombre: "C",
          pisos: [1, 2, 3],
          estado: "Fuera de servicio"
        },
        {
          id: "8d6ae08a-3dbd-4ec3-8fda-758e3e0c1e41",
          nombre: "D",
          pisos: [5, 6, 7],
          estado: "Disponible"
        },
        {
          id: "31907f35-17c1-459a-a99e-4b1ee084f01b",
          nombre: "E",
          pisos: [4, 8, 10],
          estado: "Disponible"
        }
      ];

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
    return ascensores[ascensores.length-1];
  }

  const getAscensores = async () => {
    return ascensores;
  };

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

export { getAscensores, ultimoAscensor,  agregarAscensor, modificarAscensor};