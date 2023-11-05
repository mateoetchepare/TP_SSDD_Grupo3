import NavBar from "./navbar.controller.js";
import Ascensores from "./ascensores.controller.js";
import Visitantes from "./visitantes.controller.js";
import NotFound from "./404.controller.js";

const pages = {
  navbar: NavBar,
  ascensores: Ascensores,
  visitantes: Visitantes,
  notFound: NotFound,
};

export { pages };