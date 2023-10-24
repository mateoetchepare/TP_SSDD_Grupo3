import Ascensores from "./ascensores.controller.js";
import Visitantes from "./visitantes.controller.js";
import NotFound from "./404.controller.js";

const pages = {
  ascensores: Ascensores,
  visitantes: Visitantes,
  notFound: NotFound,
};

export { pages };