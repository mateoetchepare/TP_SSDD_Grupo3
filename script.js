import { router } from "./js/router/index.router.js";


const init = () => {
    router(window.location.hash);
  
    window.addEventListener("hashchange", () => {
      router(window.location.hash);
    });
  };

if(window.location.hash === '')
    window.location.hash = '#/'

  window.addEventListener("load", init);


 
  
