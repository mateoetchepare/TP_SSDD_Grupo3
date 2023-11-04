
let visitantes = [
  {
    id: "A001",
    nombre: "Carlos Pérez",
    edad: 30,
    email: "carlos@gmail.com",
    pisos_permitidos: [1, 3, 5],
    fecha_checkIn: "2009-04-11",
    fecha_checkOut: "2011-06-12",
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
  const nuevoVisitante = {
    id: "",
    nombre: "",
    edad: 0,
    email: "",
    pisos_permitidos: [],
    fecha_checkIn: "",
    fecha_checkOut: "",
  };
  visitantes.push(nuevoVisitante);
}

function modificarInfoVisitantes(idVisit, nombreVisit, edadVisit, emailVisit, fechaVisitIn, fechaVisitOut) {
  const indice = visitantes.findIndex(visitante => visitante.id === idVisit);
  console.log(indice);
  if (indice !== -1) {
    const visitanteModificado = {
      id: idVisit,
      nombre: nombreVisit,
      edad: edadVisit,
      pisos_permitidos: [],
      email: emailVisit,
      fecha_checkIn: fechaVisitIn,
      fecha_checkOut: fechaVisitOut
    }
    visitantes[indice] = visitanteModificado;
    console.log(visitantes[indice]);
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

function ultimoVisitante() {
  return visitantes[visitantes.length - 1];
}

const getVisitantes = async () => {
  return visitantes;
};


export { getVisitantes, agregarVisitante, ultimoVisitante, modificarInfoVisitantes, modificarPermisosVisitantes};

