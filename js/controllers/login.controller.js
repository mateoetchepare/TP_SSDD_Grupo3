
export default async () => {

    const view =
        `
        <div id="fondo_login">
            <div class="login-box">
                <h1>Administracion</h1>
                <input type="button" id="btnLogin" value="Login" />
           </div> 
        </div>
      `;

    const divElement = document.createElement("div");
    divElement.innerHTML = view;
    divElement.className = "divLogin"


    return divElement;
};