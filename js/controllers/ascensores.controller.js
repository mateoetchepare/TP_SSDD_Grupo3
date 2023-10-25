import { getAscensores } from "../services/ascensores.services.js";



export default async() => {

  const view = 
    `<h3>Lista ascensores</h3>
        <ul class="list-group" id="listaAscensores" style="height: 70vh; overflow: auto">

        </ul>
    `;

  const divElement = document.createElement("div");
  divElement.innerHTML = view;
  divElement.className = "divAscensores"

  //Recupera ascensores del back y genera un elemento HTML para cada uno

  const createHTMLelements=async () => {

    const ascensores = await getAscensores();
    console.log(ascensores);
    const listaAscensoresElement = divElement.querySelector("#listaAscensores");

    ascensores.forEach(ascensor => {  
        listaAscensoresElement.innerHTML += `
        <li class = "elementoAscensor">
            <a class="tagItem">${ascensor.id}</a>
            <input type="text" class="textFieldNombreAscensor" placeholder="nombre" value='${ascensor.nombre}' required>
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
                <label class="labelBorrar">Borrar</label>
                <span class="garbageItem"><i class="fa-solid fa-trash"></i></span>
            </button>

        </li>`
        
    });
  }

   await createHTMLelements();


  //Agrega, en cada lista de opciones, las 25 opciones con JS

  const addListOptions = () => {
    const listaOpciones = divElement.querySelectorAll(".list-items");//Agarro todas las listas de opciones 
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

  //Agregar un evento de click a cada botón de selección

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
            btnText.innerText = `${checked.length} Pisos Permitidos`;
        } else {
            btnText.innerText = "0 Pisos Permitidos";
        }
    });
});


  return divElement;
};