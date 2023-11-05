
export default async () => {

    const view =
        `
        <div class="container-login"> 
            <div class="login-box">
                <h1>Administracion</h1>
                <input type="button" id="botonLogin" value="Login" />
           </div> 
        </div>
      `;

    const divElement = document.createElement("div");
    divElement.innerHTML = view;
    divElement.className = "divLogin"
    const body = document.querySelector("body");
    body.style.height= '100vh';

    return divElement;
};