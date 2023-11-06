
export const createAuthClient = (divElement) => {

  auth0.createAuth0Client({
    domain: "dev-h74gvie66akma5zh.us.auth0.com",
    clientId: "LHeNnWrtoPJVYK7vFbQnVpcf2LPzOzCu",
    authorizationParams: {
      redirect_uri: 'http://127.0.0.1:5500/index.html#/visitantes' 
    }
  }).then(async (auth0Client) => { //Se carga el cliente de auth0 para llamar a los metodos de login y logout
        
    const loginButton = divElement.querySelector("#botonLogin");
        
    loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    auth0Client.loginWithRedirect();
    });
      
    if (location.search.includes("state=") && 
    (location.search.includes("code=") || 
    location.search.includes("error="))) {
      auth0Client.handleRedirectCallback().then((token) =>{//Aca hay un problema, como cambio de componente, no me hace las cosas de la linea 26 en adelante
      auth0Client.getIdTokenClaims().then(sessionData =>{

        console.log(token)
        console.log(sessionData)
        if(sessionData) {
          window.sessionStorage.setItem('token',sessionData.__raw)
          window.sessionStorage.setItem('email',sessionData.email)
          window.sessionStorage.setItem('userId',generateUserId(sessionData.email))
        }
        window.history.replaceState({}, document.title, "/");
        window.location.hash = '#/visitantes'
        }); //ACA TENGO EL TOKEN ID      
      });
    }
  });

}

export const createAuthClientLogOut = (divElement) => {
  auth0.createAuth0Client({
      domain: "dev-h74gvie66akma5zh.us.auth0.com",
      clientId: "LHeNnWrtoPJVYK7vFbQnVpcf2LPzOzCu",
      //responseType:'code',
      authorizationParams: {
          redirect_uri: 'http://127.0.0.1:5500/index.html#/login'
      }
}).then(async (auth0Client) => {

  const logoutButton = divElement.querySelector("#botonLogout");

  logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Por hacer logout")
    auth0Client.logout();
    window.sessionStorage.removeItem('token')
    window.sessionStorage.removeItem('userId')
    window.sessionStorage.removeItem('email')
  });
})
}