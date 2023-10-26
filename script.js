import { router } from "./js/router/index.router.js";
import { agregarVisitante } from "./js/services/visitantes.services.js";

const init = () => {
    router(window.location.hash);
  
    window.addEventListener("hashchange", () => {
      router(window.location.hash);
    });
  };

if(window.location.hash === '')
    window.location.hash = '#/'

  window.addEventListener("load", init);

  document.addEventListener("DOMContentLoaded", function() {
  const botonNuevoVisitante = document.getElementById("nuevoVisitante");
  botonNuevoVisitante.addEventListener("click", agregarVisitante);
});
  
