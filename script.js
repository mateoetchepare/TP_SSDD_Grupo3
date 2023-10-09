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
            btnText.innerText = "0 Pisos Permitidos";
        }
    });
});
