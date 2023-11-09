import { getAscensores, agregarAscensor, modificarAscensor, existeAscensor } from "../services/ascensores.services.js";



export default async () => {

    const view =
        `<div class="listaBotonAscensores">
        <h3>Lista ascensores</h3>
        <button class="botonNuevo" id="nuevoAscensor">
            <label class="labelNuevo">Nuevo</label>
            <span class="newItem"><i class="fa-regular fa-pen-to-square"></i></span>
        </button>
    </div>
        <ul class="list-group" id="listaAscensores">

        </ul>
    `;

    const divElement = document.createElement("div");
    divElement.innerHTML = view;
    divElement.className = "divAscensores"

    //Recupera ascensores del back y genera un elemento HTML para cada uno


    const ascensores = await getAscensores();
    const listaAscensoresElement = divElement.querySelector("#listaAscensores");
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
        const listaOpciones = divElement.querySelectorAll(".list-items");//Agarro todas las listas de opciones 

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
        const selectBtns = divElement.querySelectorAll(".select-btn");
        const items = divElement.querySelectorAll(".item");

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

    const botonNuevoAscensor = divElement.querySelector("#nuevoAscensor");
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
                    console.log(numeroPiso);
                    if (pisosHabilitados.includes(numeroPiso)) {
                        item.classList.add('checked');
                        console.log(pisosHabilitados, numeroPiso);
                    }
                    btnText.innerText = `${ascensor.pisos.length} Pisos Habilitados`;
                });
            }
        });
    }

    function guardarInfo() {
        const botonesGuardar = divElement.querySelectorAll('.elementoAscensor .botonGuardar');
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

    addListOptions();
    querySelectBtns();
    guardarInfo();

    function habilitaDeshabilitaBotonNuevo() {
        const botonNuevo = divElement.querySelector("#nuevoAscensor");
        const ultimoElementoLi = listaAscensoresElement.lastElementChild;
        const ultimoElementoTagItem = ultimoElementoLi.querySelector(".tagItem").textContent;
        const idAscensor = ultimoElementoTagItem.split(" ");
        if (!existeAscensor(idAscensor)) {
            botonNuevo.disabled = true;
        } else {
            botonNuevo.disabled = false;
        }
        return divElement;
    }

   // esto levanta los pisos tildados de cada ascensor
   const elementosAscensor1 = listaAscensoresElement.querySelectorAll('.elementoAscensor');
   const cantidadElementos = elementosAscensor1.length;
   if (cantidadElementos === ascensores.length) {
       tildaItems();
   }
    return divElement;


}