import { pages } from "../controllers/index.js";

const router = async (route) => {
  let content = document.getElementById("root");
  content.innerHTML = '';

  console.log(route);

  switch (route) {
    case '#/': {
      content.appendChild(pages.navbar());return content.appendChild(await pages.visitantes());
    }
    case '#/login': {
      return content.appendChild(await pages.login());
    }
    case '#/visitantes': {
      content.appendChild(pages.navbar());return content.appendChild(await pages.visitantes());
    }
    case '#/ascensores': {
      content.appendChild(pages.navbar());return content.appendChild(await pages.ascensores());
    }
    default: {
      return content.appendChild(pages.notFound());
    }
  }
};

export { router };