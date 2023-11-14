
import { agregarVisitante, getVisitantes, modificarInfoVisitantes, modificarPermisosVisitantes, existeVisitante, borrarVisitante } from "./js/services/visitantes.services.js";
import { getAscensores, agregarAscensor, modificarAscensor, existeAscensor, borrarAscensor } from "./js/services/ascensores.services.js";

function mostrarOcultarElementos() {
  let hash = window.location.hash;
  var ruta = hash.substring(1).replace('/', '#');

  if (!hash || hash === '#'){
    window.location.hash = '#/visitantes';
    hash = window.location.hash;
    ruta = hash.substring(1).replace('/', '#');
  }

  const containerLogin = document.querySelector('#login');
  const containerNavBar = document.querySelector('#NavBar');
  const containerVisitantes = document.querySelector('#visitantes');
  const containerAscensores = document.querySelector('#ascensores');


  
    if (hash === '#/visitantes') {
        containerLogin.style.display = 'none';
        containerNavBar.style.display = 'flex';
        containerVisitantes.style.display = 'flex';
        containerAscensores.style.display = 'none';
        logicaVisitantes();
    } 
    else if (hash === '#/ascensores') {
        containerLogin.style.display = 'none'; 
        containerNavBar.style.display = 'flex';
        containerVisitantes.style.display = 'none';
        containerAscensores.style.display = 'flex';
      logicaAscensores();
    }
    else if (hash === '#/login') {
        containerLogin.style.display = 'flex';
        containerNavBar.style.display = 'none';
        containerVisitantes.style.display = 'none';
        containerAscensores.style.display = 'none';
    }

  }

// Ejecutar la función al cargar la página y cuando cambie la ruta
window.addEventListener('load', mostrarOcultarElementos);
window.addEventListener('hashchange', mostrarOcultarElementos);

//LOGICA VISITANTES

async function logicaVisitantes(){
  //Recupera visitantes del back y genera un elemento HTML para cada uno
  let visitantes = await getVisitantes();
  const listaVisitantesElement = document.querySelector("#listaVisitantes");
  listaVisitantesElement.innerHTML = "";
  console.log(listaVisitantesElement);
  for (const visitante of visitantes) {
      await createHTMLelements(visitante);
  }

  async function createHTMLelements(visitante) {
      listaVisitantesElement.innerHTML += `
      <li class="elementoVisitante" id=visitante-${visitante.id}>
      <div class="infoVisitante">
          <a class="tagItem">Visitante ${visitante.id}</a>
          <input type="text" class="textFieldNombreVisitante" placeholder="nombre" value='${visitante.nombre}'
              required>
          <input type="text" class="textFieldEdadVisitante" placeholder="edad" value='${visitante.edad}' required>
          <input type="text" class="textFieldEmailVisitante" placeholder="email" value='${visitante.email}' required>
          <div class="containerDatePicker1">
              <label class="fechaIngreso">Fecha Ingreso</label>
              <input type="date" class="datePicker" id="dateFechaIn">
          </div>
          <div class="containerDatePicker2">
              <label class="fechaEgreso">Fecha Egreso</label>
              <input type="date" class="datePicker" id="dateFechaOut">
          </div>
          <button class="botonGuardar" id="guardarInfoVisitante-${visitante.id}>
              <label class="labelGuardar">Guardar</label>
              <span class="saveItem"><i class="fa-regular fa-floppy-disk"></i></span>
          </button>
          <button class="botonBorrar" id="borrarVisitante-${visitante.id}">
              <label class="labelBorrar">
                  Borrar
              </label>
              <span class="garbageItem">
                  <i class="fa-solid fa-trash"></i>
              </span>
          </button>
      </div>
      <div class="infoPisos">
          <div class="picker">
              <div class="select-btn">
                  <span class="btn-text">Seleccione Pisos Permitidos</span>
                  <span class="arrow-dwn">
                      <i class="fa-solid fa-chevron-down"></i>
                  </span> 
              </div>
              <ul class="list-items">
                  <li class="item">
                      <span class="checkbox">
                          <i class="fa-solid fa-check check-icon"></i>
                      </span>
                      <span class="item-text">1</span>
                  </li>
              </ul>
          </div>
          <button class="botonGuardarPisos" id="guardarPermisosVisitantes-${visitante.id}">
              <label class="labelGuardar">Guardar</label>
              <span class="saveItem"><i class="fa-regular fa-floppy-disk"></i></span>
      </button>
      </div>
  </li>
          `
  }

  const botonNuevoVisitante = document.querySelector("#nuevoVisitante");
  botonNuevoVisitante.addEventListener("click", async function () {
      const ultVisitante = agregarVisitante();
      await createHTMLelements(ultVisitante);
      addListOptions();
      querySelectBtns();
      recuperarFecha();
      guardarInfo();
      guardarPisos();
      habilitaDeshabilitaBotonNuevo();
  });

  //Agrega, en cada lista de opciones, las 25 opciones con JS

  const addListOptions = () => {
      const listaOpciones = document.querySelectorAll(".list-items");

      listaOpciones.forEach(listaOpciones => {
          for (let i = 2; i <= 25; i++) {
              const li = document.createElement("li");
              li.className = "item";

              const checkboxSpan = document.createElement("span");
              checkboxSpan.className = "checkbox";
              checkboxSpan.innerHTML = '<i class="fa-solid fa-check check-icon"></i>';

              const itemTextSpan = document.createElement("span");
              itemTextSpan.className = "item-text";
              itemTextSpan.textContent = i;

              li.appendChild(checkboxSpan);
              li.appendChild(itemTextSpan);

              listaOpciones.appendChild(li);
          }
      });
  }

  function querySelectBtns() {
      // Obtener todos los botones de selección y elementos de ítem
      const selectBtns = document.querySelectorAll(".select-btn");
      const items = document.querySelectorAll(".item");

      // Agregar un evento de clic a cada botón de selección
      selectBtns.forEach((selectBtn, index) => {
          selectBtn.addEventListener("click", () => {
              // Obtener los elementos relacionados para el picker específico
              const itemsForPicker = items[index];
              selectBtn.classList.toggle("open");
              itemsForPicker.classList.toggle("open");
          });
      });

      // Agregar un evento de clic a cada elemento de ítem
      items.forEach((item, index) => {
          item.addEventListener("click", () => {
              item.classList.toggle("checked");
              // Obtener los elementos relacionados para el picker específico
              const picker = item.closest(".picker");
              const btnText = picker.querySelector(".btn-text");
              const checked = picker.querySelectorAll(".checked");

              if (checked && checked.length > 0) {
                  btnText.innerText = `${checked.length} Pisos Permitidos`;
              } else {
                  btnText.innerText = "Seleccione Pisos Permitidos";
              }
          });
      });
  }

  function recuperarPisos() {
      const elementosVisitante = listaVisitantesElement.querySelectorAll('.elementoVisitante');
      elementosVisitante.forEach(elementoVisitante => {
          const visitanteId = elementoVisitante.querySelector('.tagItem'); // Obtener el elemento con la clase "tagItem"
          const idVisitante = visitanteId.textContent; // Obtener el contenido (ID del visitante)
          const idVisitanteFormateado = idVisitante.split(" ");
          const visitante = visitantes.find(vis => vis.id == idVisitanteFormateado[1]);
          if (visitante) {
              const pisosHabilitados = visitante.pisos_permitidos;
              const listaItems = elementoVisitante.querySelector('.list-items');
              listaItems.querySelectorAll('.item').forEach(item => {
                  const picker = item.closest(".picker");
                  const btnText = picker.querySelector(".btn-text");
                  const checked = picker.querySelectorAll(".checked");
                  const itemText = item.querySelector('.item-text');
                  const numeroPiso = parseInt(itemText.textContent, 10);
                  if (pisosHabilitados.includes(numeroPiso)) {
                      item.classList.add('checked');
                  }
                  btnText.innerText = `${visitante.pisos_permitidos.length} Pisos Permitidos`;
              });
          }
      });
  }

  function recuperarFecha() {
      const elementosVisitantes = listaVisitantesElement.querySelectorAll('.elementoVisitante');
      elementosVisitantes.forEach(elementoVisitante => {
          const visitanteId = elementoVisitante.querySelector('.tagItem'); // Obtener el elemento con la clase "tagItem"
          const idVisitante = visitanteId.textContent; // Obtener el contenido (ID del visitante)
          const idVisitanteFormateado = idVisitante.split(" ");
          const visitante = visitantes.find(vis => vis.id == idVisitanteFormateado[1]);
          if (visitante) {
              const fechas = elementoVisitante.querySelectorAll(".datePicker");
              const fechaISO8601_checkIn = visitante.fecha_checkIn;
              const fecha_In = new Date(fechaISO8601_checkIn);
              const yyyy_In = fecha_In.getFullYear();
              const mm_In = String(fecha_In.getMonth() + 1).padStart(2, '0'); // El mes es 0-indexado, por lo que sumamos 1 y lo formateamos
              const dd_In = String(fecha_In.getDate()).padStart(2, '0'); // Formateamos el día
              const fecha_checkInFormateada = `${yyyy_In}-${mm_In}-${dd_In}`;

              const fechaISO8601_checkOut = visitante.fecha_checkOut;
              const fecha_Out = new Date(fechaISO8601_checkOut);
              const yyyy_Out = fecha_Out.getFullYear();
              const mm_Out = String(fecha_Out.getMonth() + 1).padStart(2, '0'); // El mes es 0-indexado, por lo que sumamos 1 y lo formateamos
              const dd_Out = String(fecha_Out.getDate()).padStart(2, '0'); // Formateamos el día
              const fecha_checkOutFormeateada = `${yyyy_Out}-${mm_Out}-${dd_Out}`;

              fechas[0].value = fecha_checkInFormateada;
              fechas[1].value = fecha_checkOutFormeateada;
          }
      });
  }

  function guardarInfo() {
      const botonesGuardar = document.querySelectorAll('.elementoVisitante .botonGuardar');
      botonesGuardar.forEach(botonGuardar => {
          botonGuardar.addEventListener('click', async () => {
              const idVisitanteCompleto = botonGuardar.parentElement.querySelector('.tagItem').textContent;
              const idVisitante = idVisitanteCompleto.split(" ");
              const nuevoNombre = botonGuardar.parentElement.querySelector('.textFieldNombreVisitante').value;
              const nuevaEdadString = botonGuardar.parentElement.querySelector('.textFieldEdadVisitante').value;
              const nuevaEdad = parseInt(nuevaEdadString);
              const nuevoEmail = botonGuardar.parentElement.querySelector('.textFieldEmailVisitante').value;
              const nuevasFechas = botonGuardar.parentElement.querySelectorAll('.datePicker');

              const fecha_checkIn = new Date(nuevasFechas[0].value);
              fecha_checkIn.setUTCHours(10);
              fecha_checkIn.setUTCMinutes(0);
              fecha_checkIn.setUTCSeconds(0);
              fecha_checkIn.setUTCMilliseconds(0);
              const fecha_checkInFormateada = fecha_checkIn.toISOString();

              const fecha_checkOut = new Date(nuevasFechas[1].value);
              fecha_checkOut.setUTCHours(15);
              fecha_checkOut.setUTCMinutes(0);
              fecha_checkOut.setUTCSeconds(0);
              fecha_checkOut.setUTCMilliseconds(0);
              const fecha_checkOutFormateada = fecha_checkOut.toISOString();

              console.log(fecha_checkInFormateada);
              console.log(fecha_checkOutFormateada);

              modificarInfoVisitantes(idVisitante[1], nuevoNombre, nuevaEdad, nuevoEmail, fecha_checkInFormateada, fecha_checkOutFormateada);
          });
      });
  }

  function guardarPisos() {
      const botonesGuardarPisos = document.querySelectorAll('.elementoVisitante .botonGuardarPisos');
      botonesGuardarPisos.forEach(botonGuardarPisos => {
          botonGuardarPisos.addEventListener('click', async () => {
              const idVisitanteCompleto = botonGuardarPisos.closest('.elementoVisitante').querySelector('.tagItem').textContent;
              const idVisitante = idVisitanteCompleto.split(" ");
              const itemsChecked = Array.from(botonGuardarPisos.parentElement.querySelectorAll('.item.checked'));
              const itemsSeleccionados = itemsChecked.map(item => parseInt(item.querySelector('.item-text').textContent, 10));
              modificarPermisosVisitantes(idVisitante[1], itemsSeleccionados);
              console.log(idVisitante[1], itemsSeleccionados);
          });
      });
  }

  function initDeleteButtons() {
      const botonesBorrar = document.querySelectorAll('.elementoVisitante .botonBorrar');
      botonesBorrar.forEach(botonBorrar => {
          botonBorrar.addEventListener('dblclick', async () => {
              // Obtener el ID del visitante a partir del botón de borrado
              const idVisitanteCompleto = botonBorrar.parentElement.querySelector('.tagItem').textContent;
              const idVisitante = idVisitanteCompleto.split(" ")[1];

              const elementoVisitante = botonBorrar.parentElement.parentElement;
              borrarVisitante(idVisitante);

          });
      });
  }

  addListOptions();
  querySelectBtns();
  guardarInfo();
  guardarPisos();

  const elementosVisitante = listaVisitantesElement.querySelectorAll('.elementoVisitante');
  const cantidadElementos = elementosVisitante.length;
  console.log(elementosVisitante);
  console.log(visitantes.length);
  if (cantidadElementos === visitantes.length) {
      recuperarFecha();
      recuperarPisos();
      initDeleteButtons();
  }

  function habilitaDeshabilitaBotonNuevo() {
      const botonNuevo = document.querySelector("#nuevoVisitante");
      const ultimoElementoLi = listaVisitantesElement.lastElementChild;
      const ultimoElementoTagItem = ultimoElementoLi.querySelector(".tagItem").textContent;
      const idVisitante = ultimoElementoTagItem.split(" ");
      if (!existeVisitante(idVisitante)) {
          botonNuevo.disabled = true;
      } else {
          botonNuevo.disabled = false;
      }
      //return divElement; VER SI DEJAR ESTO O NO
  }
}
  



async function logicaAscensores(){
  const ascensores = await getAscensores();
    const listaAscensoresElement = document.querySelector("#listaAscensores");
    listaAscensoresElement.innerHTML = "";
    for (const ascensor of ascensores) {
        await createHTMLelements(ascensor);
    }

    async function createHTMLelements(ascensor) {
        listaAscensoresElement.innerHTML += `
    <li class = "elementoAscensor">
        <a class="tagItem">${ascensor.id}</a>
        <input type="text" class="textFieldNombreAscensor" placeholder="nombre" value='${ascensor.nombre}' required>
        <div class="picker">
            <div class="select-btn">
                <span class="btn-text">Seleccione Pisos Habilitados</span>
                <span class="arrow-dwn">
                    <i class="fa-solid fa-chevron-down"></i>
                </span>
            </div>

            <ul class="list-items">
                <li class="item">
                    <span class="checkbox">
                        <i class="fa-solid fa-check check-icon"></i>
                    </span>
                    <span class="item-text">1</span>
                </li>
            </ul>
        </div>
        <button class="botonGuardar">
            <label class="labelGuardar">Guardar</label>
            <span class="saveItem"><i class="fa-regular fa-floppy-disk"></i></span>
        </button>
        <button class="botonBorrar">
            <label class="labelBorrar">Borrar</label>
            <span class="garbageItem"><i class="fa-solid fa-trash"></i></span>
        </button>

    </li>`

    }

    //Agrega, en cada lista de opciones, las 25 opciones con JS

    const addListOptions = () => {
        const listaOpciones = document.querySelectorAll(".list-items");//Agarro todas las listas de opciones 

        listaOpciones.forEach(listaOpciones => {
            for (let i = 2; i <= 25; i++) {
                const li = document.createElement("li");
                li.className = "item";

                const checkboxSpan = document.createElement("span");
                checkboxSpan.className = "checkbox";
                checkboxSpan.innerHTML = '<i class="fa-solid fa-check check-icon"></i>';

                const itemTextSpan = document.createElement("span");
                itemTextSpan.className = "item-text";
                itemTextSpan.textContent = i;

                li.appendChild(checkboxSpan);
                li.appendChild(itemTextSpan);

                listaOpciones.appendChild(li);
            }
        });
    }

    //Agregar un evento de click a cada botón de selección
    function querySelectBtns() {
        const selectBtns = document.querySelectorAll(".select-btn");
        const items = document.querySelectorAll(".item");

        selectBtns.forEach((selectBtn, index) => {
            selectBtn.addEventListener("click", () => {
                // Obtener los elementos relacionados para el picker específico
                const itemsForPicker = items[index];
                selectBtn.classList.toggle("open");
                itemsForPicker.classList.toggle("open");
            });
        });

        // Agregar un evento de click a cada elemento de ítem
        items.forEach((item, index) => {
            item.addEventListener("click", () => {
                item.classList.toggle("checked");
                // Obtener los elementos relacionados para el picker específico
                const picker = item.closest(".picker");
                const btnText = picker.querySelector(".btn-text");
                const checked = picker.querySelectorAll(".checked");

                if (checked && checked.length > 0) {
                    btnText.innerText = `${checked.length} Pisos Habilitados`;
                } else {
                    btnText.innerText = "Seleccione Pisos Habilitados";
                }
            });
        });
    }

    const botonNuevoAscensor = document.querySelector("#nuevoAscensor");
    botonNuevoAscensor.addEventListener("click", async function () {
        agregarAscensor();
        const ultAscensor = agregarAscensor();
        await createHTMLelements(ultAscensor);
        addListOptions();
        querySelectBtns();
        guardarInfo();
        habilitaDeshabilitaBotonNuevo()
    });

    function tildaItems() {
        const elementosAscensor = listaAscensoresElement.querySelectorAll('.elementoAscensor');
        elementosAscensor.forEach(elementoAscensor => {
            const ascensorId = elementoAscensor.querySelector('.tagItem'); // Obtener el elemento con la clase "tagItem"
            const idAscensor = ascensorId.textContent; // Obtener el contenido (ID del ascensor)
            const ascensor = ascensores.find(asc => asc.id == idAscensor);
            if (ascensor) {
                const pisosHabilitados = ascensor.pisos;
                const listaItems = elementoAscensor.querySelector('.list-items');
                listaItems.querySelectorAll('.item').forEach(item => {
                    const picker = item.closest(".picker");
                    const btnText = picker.querySelector(".btn-text");
                    const checked = picker.querySelectorAll(".checked");
                    const itemText = item.querySelector('.item-text');
                    const numeroPiso = parseInt(itemText.textContent, 10);
                    if (pisosHabilitados.includes(numeroPiso)) {
                        item.classList.add('checked');
                    }
                    btnText.innerText = `${ascensor.pisos.length} Pisos Habilitados`;
                });
            }
        });
    }

    function guardarInfo() {
        const botonesGuardar = document.querySelectorAll('.elementoAscensor .botonGuardar');
        botonesGuardar.forEach(botonGuardar => {
            botonGuardar.addEventListener('click', async () => {
                const idAscensor = botonGuardar.parentElement.querySelector('.tagItem').textContent;
                const nuevoNombre = botonGuardar.parentElement.querySelector('.textFieldNombreAscensor').value;
                const itemsChecked = Array.from(botonGuardar.parentElement.querySelectorAll('.item.checked'));
                const itemsSeleccionados = itemsChecked.map(item => parseInt(item.querySelector('.item-text').textContent, 10));
                modificarAscensor(idAscensor, nuevoNombre, itemsSeleccionados);
            });
        });
    }

    function initDeleteButtons() {
        const botonesBorrar = document.querySelectorAll('.elementoAscensor .botonBorrar');
        botonesBorrar.forEach(botonBorrar => {
            botonBorrar.addEventListener('dblclick', async () => {
                // Obtener el ID del visitante a partir del botón de borrado
                const idAscensorCompleto = botonBorrar.parentElement.querySelector('.tagItem').textContent;
                const idAscensor = idAscensorCompleto;

                const elementoAscensor = botonBorrar.parentElement.parentElement;
                borrarAscensor(idAscensor);
            });
        });
    }

    addListOptions();
    querySelectBtns();
    guardarInfo();

    function habilitaDeshabilitaBotonNuevo() {
        const botonNuevo = document.querySelector("#nuevoAscensor");
        const ultimoElementoLi = listaAscensoresElement.lastElementChild;
        const ultimoElementoTagItem = ultimoElementoLi.querySelector(".tagItem").textContent;
        const idAscensor = ultimoElementoTagItem.split(" ");
        if (!existeAscensor(idAscensor)) {
            botonNuevo.disabled = true;
        } else {
            botonNuevo.disabled = false;
        }
        //return divElement;
    }

    // esto levanta los pisos tildados de cada ascensor
    const elementosAscensor1 = listaAscensoresElement.querySelectorAll('.elementoAscensor');
    const cantidadElementos = elementosAscensor1.length;
    if (cantidadElementos === ascensores.length) {
        tildaItems();
        initDeleteButtons();
    }
    //return divElement;
}
