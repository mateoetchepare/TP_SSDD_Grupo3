function Hash(email) {
    var hash = 0;
    if (email.length == 0) return hash;
    for (let i = 0; i < email.length; i++) {
        let char = email.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Lo convierte a un entero de 32 bit 
    }
    return (hash<0)?hash*-1:hash;
}


auth0
  .createAuth0Client({
    domain: "dev-h74gvie66akma5zh.us.auth0.com",
    clientId: "LHeNnWrtoPJVYK7vFbQnVpcf2LPzOzCu",
    authorizationParams: {
      redirect_uri: window.location.origin + '#/visitantes',
    },
  })
  .then(async (auth0Client) => {
    // Assumes a button with id "login" in the DOM
    const loginButton = document.getElementById("botonLogin");
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(window.location.origin);
      auth0Client.loginWithRedirect().then(token => {console.log(token)
        });
    });

    if (location.search.includes("state=") &&
      (location.search.includes("code=") ||
        location.search.includes("error="))) {
      auth0Client.handleRedirectCallback().then((token) => {
        auth0Client.getIdTokenClaims().then(sessionData => {
          console.log(token)
          console.log(sessionData)
          if (sessionData) {
            window.sessionStorage.setItem('token', sessionData.__raw)
            window.sessionStorage.setItem('email', sessionData.email)
            window.sessionStorage.setItem('userId', Hash(sessionData.email))
          }
          window.history.replaceState({}, document.title, "/");
          window.location.href = "#/visitantes";
         
        });
      });
    }

    // Assumes a button with id "logout" in the DOM

    const logoutButton = document.getElementById("logout");

    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.clear();
      auth0Client.logout();
    });

    auth0Client.isAuthenticated().then((isAuthenticated) => {

      if (!isAuthenticated) {
        window.location.hash="#/login";
        auth0Client.getUser().then((userProfile) => {
          console.log(userProfile);
        });
      }
    });
    const userProfile = await auth0Client.getUser();
  });
