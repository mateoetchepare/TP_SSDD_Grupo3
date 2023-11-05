import Login from "./login.controller.js";
import NavBar from "./navbar.controller.js"
import Ascensores from "./ascensores.controller.js";
import Visitantes from "./visitantes.controller.js";
import NotFound from "./404.controller.js";

const pages = {
  login: Login,
  navbar: NavBar,
  ascensores: Ascensores,
  visitantes: Visitantes,
  notFound: NotFound,

};

export { pages };