  
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
      fecha_checkIn: "2023-09-14T23:09:40.880Z",
      fecha_checkOut: "2023-09-16T23:09:40.880Z",
    },
    {
      id: "A003",
      nombre: "Luis Rodríguez",
      edad: 35,
      email: "luis@gmail.com",
      pisos_permitidos: [1, 3, 6],
      fecha_checkIn: "2023-09-15T23:09:40.880Z",
      fecha_checkOut: "2023-09-17T23:09:40.880Z",
    },
    {
      id: "A004",
      nombre: "María López",
      edad: 27,
      email: "maria@gmail.com",
      pisos_permitidos: [1, 2, 7],
      fecha_checkIn: "2023-09-16T23:09:40.880Z",
      fecha_checkOut: "2023-09-18T23:09:40.880Z",
    },
    {
      id: "A005",
      nombre: "Juan Martínez",
      edad: 32,
      email: "juan@gmail.com",
      pisos_permitidos: [1, 3, 8],
      fecha_checkIn: "2023-09-17T23:09:40.880Z",
      fecha_checkOut: "2023-09-19T23:09:40.880Z",
    },
  ];

  function agregarVisitante() {
    const nuevoVisitante = {
        id: "",
        nombre: "",
        edad: 0,
        email:"",
        pisos_permitidos: [],
        fecha_checkIn:"",
        fecha_checkOut:"",
    };
    visitantes.push(nuevoVisitante);
  }

  function ultimoVisitante() {
    return visitantes[visitantes.length-1];
  }

  const getVisitantes = async () => {
    return visitantes;
  };


export { getVisitantes, agregarVisitante, ultimoVisitante };

