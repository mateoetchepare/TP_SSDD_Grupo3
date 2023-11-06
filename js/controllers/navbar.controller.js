export default () => {

    const view =
        `
        <header class="header">
        <a href="#/" class="logo">Administración</a>

            <nav class="navbar">
                <a class="Ascensores" href="#/ascensores">Ascensores</a>
                <a class="Visitantes" href="#/visitantes">Visitantes</a>
                <a class="Visitantes" id="logout" >Logout</a>
            </nav>
        </header>
      `;

    const divElement = document.createElement("div");
    divElement.innerHTML = view;

    return divElement;
};