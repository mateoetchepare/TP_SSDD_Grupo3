import { pages } from "../controllers/index.js";

const router = async (route) => {
  let content = document.getElementById("root");
  content.innerHTML = "";

  console.log(route);

  switch (route) {
    case '#/': {
      return content.appendChild(await pages.visitantes());
    }
    case '#/visitantes': {
      return content.appendChild(await pages.visitantes());
    }
    case '#/ascensores': {
      return content.appendChild(await pages.ascensores());
    }
    default: {
      return content.appendChild(pages.notFound());
    }
  }
};

export { router };