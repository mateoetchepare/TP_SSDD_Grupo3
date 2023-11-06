import { agregarVisitante, getVisitantes, ultimoVisitante, modificarInfoVisitantes, modificarPermisosVisitantes } from "../services/visitantes.services.js";

export default async () => {

    const view =
        `
    <div class="listaBotonVisitantes">
    <h3>Lista visitantes</h3>
    <button class="botonNuevo" id="nuevoVisitante">
        <label class="labelNuevo">Nuevo</label>
        <span class="newItem"><i class="fa-regular fa-pen-to-square"></i></span>
    </button>
    </div>
        <ul class="list-group" id="listaVisitantes"> </ul>
      `;

    const divElement = document.createElement("div");
    divElement.innerHTML = view;
    divElement.className = "divVisitantes"

    //Recupera visitantes del back y genera un elemento HTML para cada uno
    let visitantes = await getVisitantes();
    const listaVisitantesElement = divElement.querySelector("#listaVisitantes");
    for (const visitante of visitantes) {
        await createHTMLelements(visitante);
    }

    async function createHTMLelements(visitante) {
        listaVisitantesElement.innerHTML += `
        <li class="elementoVisitante">
        <div class="infoVisitante">
            <a class="tagItem">Visitante ${visitante.id}</a>
            <input type="text" class="textFieldNombreVisitante" placeholder="nombre" value='${visitante.nombre}'
                required>
            <input type="text" class="textFieldEdadVisitante" placeholder="edad" value='${visitante.edad}' required>
            <input type="text" class="textFieldEmailVisitante" placeholder="email" value='${visitante.email}' required>
            <div class="containerDatePicker1">
                <label class="fechaIngreso">Fecha Ingreso</label>
                <input type="date" class="datePicker">
            </div>
            <div class="containerDatePicker2">
                <label class="fechaEgreso">Fecha Egreso</label>
                <input type="date" class="datePicker">
            </div>
            <button class="botonGuardar" id="guardarInfoVisitante">
                <label class="labelGuardar">Guardar</label>
                <span class="saveItem"><i class="fa-regular fa-floppy-disk"></i></span>
            </button>
            <button class="botonBorrar">
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
            <button class="botonGuardarPisos" id="guardarPermisosVisitantes">
                <label class="labelGuardar">Guardar</label>
                <span class="saveItem"><i class="fa-regular fa-floppy-disk"></i></span>
        </button>
        </div>
    </li>
            `
    }

    const botonNuevoVisitante = divElement.querySelector("#nuevoVisitante");
    botonNuevoVisitante.addEventListener("click", async function () {
        agregarVisitante();
        const ultVisitante = ultimoVisitante();
        await createHTMLelements(ultVisitante);
        addListOptions();
        querySelectBtns();
        recuperarFecha();
        guardarInfo();
        guardarPisos();
    });


    //Agrega, en cada lista de opciones, las 25 opciones con JS

    const addListOptions = () => {
        const listaOpciones = divElement.querySelectorAll(".list-items");

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
        const selectBtns = divElement.querySelectorAll(".select-btn");
        const items = divElement.querySelectorAll(".item");

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
        const botonesGuardar = divElement.querySelectorAll('.elementoVisitante .botonGuardar');
        botonesGuardar.forEach(botonGuardar => {
            botonGuardar.addEventListener('click', async () => {
                const idVisitanteCompleto = botonGuardar.parentElement.querySelector('.tagItem').textContent;
                const idVisitante = idVisitanteCompleto.split(" ");
                const nuevoNombre = botonGuardar.parentElement.querySelector('.textFieldNombreVisitante').value;
                const nuevaEdad = botonGuardar.parentElement.querySelector('.textFieldEdadVisitante').value;
                const nuevoEmail = botonGuardar.parentElement.querySelector('.textFieldEmailVisitante').value;
                const nuevasFechas = botonGuardar.parentElement.querySelectorAll('.datePicker');


                const nuevaFecha_checkIn = nuevasFechas[0].value;
                console.log(nuevaFecha_checkIn);
                const nuevaFecha_checkOut = nuevasFechas[1].value;
                modificarInfoVisitantes(idVisitante[1], nuevoNombre, nuevaEdad, nuevoEmail, nuevaFecha_checkIn, nuevaFecha_checkOut);
            });
        });
    }

    function guardarPisos() {
        const botonesGuardarPisos = divElement.querySelectorAll('.elementoVisitante .botonGuardarPisos');
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
    }

    return divElement;
};