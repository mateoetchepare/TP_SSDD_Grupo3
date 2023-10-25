import { getVisitantes } from "../services/visitantes.services.js";

export default async() => {

    const view = 
    `<h3>Lista visitantes</h3>
        <ul class="list-group" id="listaVisitantes" style="height: 70vh; overflow: auto"> </ul>
      `;
  
    const divElement = document.createElement("div");
    divElement.innerHTML = view;
    divElement.className = "divVisitantes"

    //Recupera visitantes del back y genera un elemento HTML para cada uno
    const visitantes = await getVisitantes();
    console.log(visitantes);
    const listaVisitantesElement = divElement.querySelector("#listaVisitantes");


    const createHTMLelements=async () => {
        visitantes.forEach(visitante => {  
            listaVisitantesElement.innerHTML += `
            <li class="elementoVisitante">
                <a class="tagItem">Visitante ${visitante.id}</a>
                <input type="text" class="textFieldNombreVisitante" placeholder="nombre" value='${visitante.nombre}'required>
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
                <div class="picker">
                    <div class="select-btn">
                        <span class="btn-text">Elija Pisos Permitidos</span>
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
                <button class="botonBorrar">
                    <label class="labelBorrar">
                        Borrar
                    </label>
                    <span class="garbageItem">
                        <i class="fa-solid fa-trash"></i>
                    </span>
                </button>
            </li>`
            
        });
    }

    await createHTMLelements();

  

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
                btnText.innerText = "0 Pisos Permitidos";
            }
        });
    });

    return divElement;
  };