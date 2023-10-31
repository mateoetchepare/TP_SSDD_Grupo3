import { agregarVisitante, getVisitantes, ultimoVisitante } from "../services/visitantes.services.js";

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
    });


    //Agrega, en cada lista de opciones, las 25 opciones con JS

    const addListOptions = () => {
        const listaOpciones = divElement.querySelectorAll(".list-items");

        console.log(listaOpciones);

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

    addListOptions();

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

    return divElement;
};